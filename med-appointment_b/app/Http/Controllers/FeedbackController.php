<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
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