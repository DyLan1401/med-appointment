<?php 

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Doctor;
use App\Models\ChatGroup;
use App\Models\Department;
use App\Models\User;

class ChatGroupSeeder extends Seeder
{
    public function run(): void
    {
        // Reset bảng
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('chat_group_user')->truncate();
        DB::table('chat_groups')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Lấy toàn bộ departments
        $departments = Department::all();

        foreach ($departments as $dep) {

            // 1. Tạo group tương ứng department (KHÔNG có specialty_name)
            $group = ChatGroup::create([
                'name' => "Nhóm Khoa " . $dep->name,
                'department_id' => $dep->id,
                'description' => "Nhóm chat cho khoa " . $dep->name,
            ]);

            // 2. Lấy bác sĩ theo specialization_id = department.id
            $doctorUserIds = Doctor::where('specialization_id', $dep->id)
                ->pluck('user_id');

            foreach ($doctorUserIds as $uid) {
                DB::table('chat_group_user')->insert([
                    'chat_group_id' => $group->id,
                    'user_id' => $uid,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // 3. Thêm toàn bộ admin vào tất cả group
            $adminIds = User::where('role', 'admin')->pluck('id');

            foreach ($adminIds as $adminId) {
                DB::table('chat_group_user')->insert([
                    'chat_group_id' => $group->id,
                    'user_id' => $adminId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}