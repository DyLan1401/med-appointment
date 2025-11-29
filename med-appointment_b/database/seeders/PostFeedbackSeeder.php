<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PostFeedback;
use App\Models\Post;
use App\Models\User;

class PostFeedbackSeeder extends Seeder
{
    public function run(): void
    {
        $postIds = Post::pluck('id')->toArray();

        // ✅ Lấy user theo role thật
        $doctorIds = User::where('role', 'doctor')->pluck('id')->toArray();
        $patientIds = User::where('role', 'patient')->pluck('id')->toArray();

        // ❌ Nếu thiếu dữ liệu thì DỪNG
        if (empty($postIds) || (empty($doctorIds) && empty($patientIds))) {
            $this->command->warn('⚠️ Không đủ post hoặc user để seed feedback!');
            return;
        }

        // ✅ Seed feedback của PATIENT
        foreach (range(1, 20) as $i) {
            if (!empty($patientIds)) {
                PostFeedback::create([
                    'post_id' => $postIds[array_rand($postIds)],
                    'user_id' => $patientIds[array_rand($patientIds)],
                    'role' => 'patient',
                    'content' => "Phản hồi của bệnh nhân số $i",
                ]);
            }
        }

        // ✅ Seed feedback của DOCTOR
        foreach (range(1, 10) as $i) {
            if (!empty($doctorIds)) {
                PostFeedback::create([
                    'post_id' => $postIds[array_rand($postIds)],
                    'user_id' => $doctorIds[array_rand($doctorIds)],
                    'role' => 'doctor',
                    'content' => "Phản hồi chuyên môn của bác sĩ số $i",
                ]);
            }
        }
    }
}
