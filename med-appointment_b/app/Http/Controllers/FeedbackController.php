<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('feedbacks')
            ->join('users as patients', 'feedbacks.user_id', '=', 'patients.id')
            ->join('doctors', 'feedbacks.doctor_id', '=', 'doctors.id')
            ->join('users as doctors_user', 'doctors.user_id', '=', 'doctors_user.id')
            ->leftJoin('departments', 'doctors.specialization_id', '=', 'departments.id')
            ->select(
                'patients.name as patient_name',
                'doctors_user.name as doctor_name',
                'departments.name as department_name',
                'feedbacks.comment',
                'feedbacks.rating',
                'feedbacks.created_at'
            )
            ->orderByDesc('feedbacks.created_at');

        // ✅ Lọc theo rating nếu có (ví dụ ?rating=5)
        if ($request->filled('rating')) {
            $query->where('feedbacks.rating', $request->rating);
        }

        // ✅ Phân trang (10 dòng mỗi trang)
        $perPage = $request->get('per_page', 10);
        $feedbacks = $query->paginate($perPage);

        return response()->json($feedbacks);

        //return response()->json($query->get());
    }

    // Lấy feedback theo bác sĩ + LỌC SAO nếu có truyền rating
    public function getByDoctor(Request $request, $doctor_id)
    {
        $rating = $request->query('rating'); // lấy rating nếu có

        $query = Feedback::with('user:id,name,email')
            ->where('doctor_id', $doctor_id)
            ->orderBy('created_at', 'desc');

        // Nếu có rating thì thêm điều kiện lọc
        if ($rating) {
            $query->where('rating', $rating);
        }

        $feedbacks = $query->get();

        return response()->json(['data' => $feedbacks], 200);
    }

    // Thêm feedback mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'user_id' => 'nullable|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $feedback = Feedback::create($validated);

        // Lấy lại feedback kèm user
        $feedback = Feedback::with('user:id,name,email')->find($feedback->id);

        return response()->json(['data' => $feedback]);
    }

    // Xóa feedback
    public function destroy($id)
    {
        $feedback = Feedback::find($id);
        if (!$feedback) {
            return response()->json(['message' => 'Không tìm thấy feedback'], 404);
        }

        $feedback->delete();
        return response()->json(['message' => 'Đã xóa feedback thành công']);
    }
}