<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Service::insert([
            [
                'name' => 'Khám tổng quát',
                'description' => 'Dịch vụ khám sức khỏe tổng quát định kỳ',
                'price' => 300000,
            ],
            [
                'name' => 'Khám nha khoa',
                'descriptsion' => 'Tư vấn và kiểm tra răng miệng',
                'price' => 200000,
            ],
            [
                'name' => 'Khám da liễu',
                'description' => 'Tư vấn và điều trị các bệnh về da',
                'price' => 250000,
            ],
        ]);
    }
}
