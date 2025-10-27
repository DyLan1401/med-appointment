<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Spatie\SimpleExcel\SimpleExcelWriter;
class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'doctor_id', 'service_id',
        'appointment_date', 'status', 'notes'
    ];
public static function getAll()
{
    return DB::table('appointments')
        ->join('patients', 'appointments.patient_id', '=', 'patients.id')
        ->join('users as patient_user', 'patients.user_id', '=', 'patient_user.id')
        ->join('services', 'appointments.service_id', '=', 'services.id')
        ->select(
            'appointments.id',
            'patient_user.name as patient_name',
            'services.name as service_name',
            'appointments.status',
            'appointments.notes',
            'appointments.appointment_date',
            'appointments.updated_at'
        )
        // 🟢 Ưu tiên theo status: pending → rejected → confirmed → completed
        ->orderByRaw("FIELD(appointments.status, 'pending', 'rejected', 'cancelled', 'confirmed', 'completed')")
        ->orderByDesc('appointments.id')
        ->get();
}


    // 🔹 Tạo mới appointment
    public static function createAppointment($data)
    {
        return DB::table('appointments')->insertGetId([
            'patient_id' => $data['patient_id'],
            'doctor_id' => $data['doctor_id'],
            'service_id' => $data['service_id'],
            'appointment_date' => $data['appointment_date'],
            'status' => $data['status'] ?? 'pending',
            'notes' => $data['notes'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    // 🔹 Lấy chi tiết appointment theo ID
    public static function getById($id)
    {
        return DB::table('appointments')
            ->join('patients', 'appointments.patient_id', '=', 'patients.id')
            ->join('users as patient_user', 'patients.user_id', '=', 'patient_user.id')
            ->join('services', 'appointments.service_id', '=', 'services.id')
            ->select(
                'appointments.id',
                'patient_user.name as patient_name',
                'services.name as service_name',
                'appointments.appointment_date',
                'appointments.status',
                'appointments.notes',
                'appointments.updated_at'
            )
            ->where('appointments.id', $id)
            ->first();
    }

    // 🔹 Cập nhật appointment (kèm kiểm tra updated_at)
    public static function updateAppointment($id, $data)
    {
        $appointment = DB::table('appointments')->where('id', $id)->first();
        if (!$appointment) return ['error' => 'not_found'];

        if ($appointment->updated_at != $data['updated_at']) {
            return ['error' => 'conflict'];
        }

        $affected = DB::table('appointments')
            ->where('id', $id)
            ->update(array_merge(
                collect($data)->only(['patient_id', 'doctor_id', 'service_id', 'appointment_date', 'status', 'notes'])->toArray(),
                ['updated_at' => now()]
            ));

        return $affected ? ['success' => true] : ['error' => 'no_changes'];
    }

    // 🔹 Xóa appointment
    public static function deleteAppointment($id)
    {
        return DB::table('appointments')->where('id', $id)->delete();
    }

    // 🔹 Lấy danh sách appointment đã hoàn thành
    public static function getCompleted()
    {
        return DB::table('appointments')
            ->join('patients', 'appointments.patient_id', '=', 'patients.id')
            ->join('users as patient_user', 'patients.user_id', '=', 'patient_user.id')
            ->join('services', 'appointments.service_id', '=', 'services.id')
            ->select(
                'appointments.id',
                'patient_user.name as patient_name',
                'services.name as service_name',
                'appointments.status',
                'appointments.notes',
                'appointments.appointment_date',
                'appointments.updated_at'
            )
            ->where('appointments.status', 'completed')
            ->orderBy('appointments.appointment_date', 'desc')
            ->get();
    }

    // 🔹 Xuất Excel danh sách hoàn thành
    public static function exportCompletedToXlsx()
    {
        $data = self::getCompleted();
        $filePath = storage_path('app/public/completed_appointments.xlsx');
        $writer = SimpleExcelWriter::create($filePath);

        $writer->addRow(['DANH SÁCH LỊCH HẸN ĐÃ HOÀN THÀNH']);
        $writer->addRow([]);
        $writer->addRow(['ID', 'Bệnh nhân', 'Dịch vụ', 'Trạng thái', 'Ghi chú', 'Ngày hẹn', 'Cập nhật lúc']);

        foreach ($data as $item) {
            $writer->addRow([
                $item->id,
                $item->patient_name,
                $item->service_name,
                ucfirst($item->status),
                $item->notes,
                $item->appointment_date,
                $item->updated_at,
            ]);
        }

        $writer->close();
        return $filePath;
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class, 'appointment_id');
    }

    public function feedback()
    {
        return $this->hasOne(Feedback::class, 'appointment_id');
    }
}
