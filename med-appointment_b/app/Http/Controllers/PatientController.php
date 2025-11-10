<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Spatie\SimpleExcel\SimpleExcelWriter;
use Spatie\SimpleExcel\SimpleExcel;

class PatientController extends Controller
{
    // API 1: Lấy thống kê bệnh nhân
    public function getStatistics(Request $request)
    {
        $period = $request->query('period'); // "this_month" | "this_quarter" | "this_year"
        $from = null;
        $to = null;

        if ($period) {
            switch ($period) {
                case 'this_month':
                    $from = Carbon::now()->startOfMonth();
                    $to = Carbon::now()->endOfMonth();
                    break;
                case 'this_quarter':
                    $from = Carbon::now()->firstOfQuarter();
                    $to = Carbon::now()->lastOfQuarter();
                    break;
                case 'this_year':
                    $from = Carbon::now()->startOfYear();
                    $to = Carbon::now()->endOfYear();
                    break;
            }
        } else {
            $from = $request->query('from');
            $to = $request->query('to');
        }

        $query = Patient::query();

        if ($from && $to) {
            $query->whereBetween('created_at', [$from, $to]);
        }

        $total = $query->count();
        $withInsurance = (clone $query)
            ->whereNotNull('health_insurance')
            ->where('health_insurance', '!=', '')
            ->count();
        $withoutInsurance = $total - $withInsurance;

        return response()->json([
            'total_patients' => $total,
            'with_insurance' => $withInsurance,
            'without_insurance' => $withoutInsurance,
            'from' => $from,
            'to' => $to,
            'period' => $period,
        ]);
    }
    // API 2: Lấy 3 bệnh nhân mới nhất
    public function getNewest()
    {
        $newestPatients = \App\Models\Patient::with('user')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->user->name ?? 'Chưa có tên',
                    'health_insurance' => $p->health_insurance,
                    'created_at' => $p->created_at,
                ];
            });

        return response()->json([
            'newest_patients' => $newestPatients,
        ]);
    }

    // Lấy danh sách bệnh nhân (tìm kiếm + phân trang)
    public function index(Request $request)
    {
        $query = Patient::with('user:id,name,email,phone');

        if ($search = $request->query('search')) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%$search%");
            });
        }

        $patients = $query->paginate(5);
        return response()->json($patients);
    }

    // Thêm bệnh nhân mới
    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'gender'  => 'nullable|string|max:10',
            'date_of_birth' => 'nullable|date',
            'health_insurance' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'phone'    => $request->phone,
                'password' => bcrypt('123456'),
            ]);

            $patient = Patient::create([
                'user_id' => $user->id,
                'address' => $request->address,
                'gender'  => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'health_insurance' => $request->health_insurance,
            ]);

            DB::commit();
            return response()->json($patient, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => '❌ Lỗi khi thêm bệnh nhân',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Lấy chi tiết bệnh nhân
    public function show($id)
    {
        $patient = Patient::with('user')->findOrFail($id);
        return response()->json($patient);
    }

    // Cập nhật thông tin bệnh nhân
    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $user = $patient->user;

        DB::beginTransaction();
        try {
            if ($user) {
                $user->update([
                    'name'  => $request->name ?? $user->name,
                    'email' => $request->email ?? $user->email,
                    'phone' => $request->phone ?? $user->phone,
                ]);
            }

            $patient->update([
                'address' => $request->address ?? $patient->address,
                'gender'  => $request->gender ?? $patient->gender,
                'date_of_birth' => $request->date_of_birth ?? $patient->date_of_birth,
                'health_insurance' => $request->health_insurance ?? $patient->health_insurance,
            ]);

            DB::commit();
            return response()->json(['message' => '✅ Cập nhật bệnh nhân thành công']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => '❌ Lỗi khi cập nhật bệnh nhân',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Xóa bệnh nhân (và user liên kết, kèm các quan hệ phụ thuộc)
    public function destroy($id)
    {
        $patient = Patient::with(['user', 'appointments', 'feedbacks', 'favorites'])->find($id);

        if (!$patient) {
            return response()->json(['message' => '❌ Không tìm thấy bệnh nhân'], 404);
        }

        DB::beginTransaction();
        try {
            // Xóa các quan hệ phụ
            $patient->appointments()->delete();
            $patient->feedbacks()->delete();
            $patient->favorites()->delete();

            // Xóa user liên kết (nếu có)
            if ($patient->user) {
                $patient->user->delete();
            }

            // Cuối cùng, xóa chính bệnh nhân
            $patient->delete();

            DB::commit();
            return response()->json(['message' => '🗑️ Đã xóa bệnh nhân thành công']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => '❌ Lỗi khi xóa bệnh nhân',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // 🔹 MỚI: Export bệnh nhân ra Excel hoặc PDF
    public function export(Request $request)
    {
        $type = $request->query('type', 'all'); // all, this_month, this_quarter, this_year, custom
        $format = $request->query('format', 'excel'); // excel, pdf
        $start = $request->query('start');
        $end = $request->query('end');

        $query = Patient::with('user');
        $now = Carbon::now();

        // Filter theo khoảng thời gian
        switch ($type) {
            case 'this_month':
                $query->whereYear('created_at', $now->year)
                    ->whereMonth('created_at', $now->month);
                break;
            case 'this_quarter':
                $quarter = ceil($now->month / 3);
                $startMonth = ($quarter - 1) * 3 + 1;
                $endMonth = $startMonth + 2;
                $query->whereYear('created_at', $now->year)
                    ->whereMonth('created_at', '>=', $startMonth)
                    ->whereMonth('created_at', '<=', $endMonth);
                break;
            case 'this_year':
                $query->whereYear('created_at', $now->year);
                break;
            case 'custom':
                if ($start && $end) {
                    $query->whereBetween('created_at', [$start, $end]);
                }
                break;
            case 'all':
            default:
                // không filter
                break;
        }

        // Map dữ liệu ra mảng thuần
        $patients = $query->get()->map(function ($p) {
            return [
                'ID' => $p->id,
                'Name' => $p->user->name ?? '',
                'Email' => $p->user->email ?? '',
                'Phone' => $p->user->phone ?? '',
                'Date of Birth' => $p->date_of_birth,
                'Gender' => $p->gender,
                'Address' => $p->address,
                'Health Insurance' => $p->health_insurance,
                'Created At' => $p->created_at->format('Y-m-d H:i:s'),
            ];
        });

        $fileName = 'patients_' . now()->format('Ymd_His');

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('exports.patients', ['patients' => $patients]);
            return $pdf->download($fileName . '.pdf');
        }

        // Mặc định là Excel
        $fileName = 'patients_'.now()->format('Ymd_His').'.xlsx';
        $tempFile = storage_path('app/'.$fileName); // tạo file trong storage

        SimpleExcelWriter::create($tempFile)
            ->addRows($patients)
            ->close();

        return response()->download($tempFile)->deleteFileAfterSend(true);
    }
}
