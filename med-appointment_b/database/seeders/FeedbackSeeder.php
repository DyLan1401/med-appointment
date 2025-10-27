<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Feedback;
use App\Models\User;
use App\Models\Doctor;
use Illuminate\Support\Str;

class FeedbackSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        $doctors = Doctor::all();

        if ($users->isEmpty() || $doctors->isEmpty()) {
            $this->command->warn('⚠️ Chưa có user hoặc doctor để tạo feedback.');
            return;
        }

        $comments = [
            "Bác sĩ rất tận tâm và chu đáo!",
            "Tôi cảm thấy yên tâm khi được khám ở đây.",
            "Thời gian chờ hơi lâu nhưng bác sĩ rất nhiệt tình.",
            "Dịch vụ tốt, tư vấn kỹ càng, đáng tin cậy.",
            "Bác sĩ dễ thương và chuyên nghiệp lắm!",
            "Phòng khám sạch sẽ, nhân viên thân thiện.",
            "Cảm ơn bác sĩ đã giúp tôi khỏi bệnh.",
            "Mong lần sau sẽ không phải chờ lâu như lần này.",
            "Bác sĩ giải thích rất rõ ràng và dễ hiểu.",
            "Rất hài lòng với chất lượng dịch vụ."
        ];

        foreach ($doctors as $doctor) {
            for ($i = 0; $i < 5; $i++) {
                $user = $users->random();
                Feedback::create([
                    'doctor_id' => $doctor->id,
                    'user_id' => $user->id,
                    'rating' => rand(3, 5),
                    'comment' => $comments[array_rand($comments)],
                    'created_at' => now()->subDays(rand(1, 60)),
                ]);
            }
        }
    }
}