<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServicesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('services')->insert([
            [
                'name' => 'Khám tổng quát',
                'description' => 'Dịch vụ kiểm tra sức khỏe toàn thân, bao gồm xét nghiệm cơ bản.',
                'price' => 300000,
            ],
            [
                'name' => 'Khám tai mũi họng',
                'description' => 'Dành cho các bệnh lý về tai, mũi, họng.',
                'price' => 250000,
            ],
            [
                'name' => 'Khám da liễu',
                'description' => 'Tư vấn và điều trị các bệnh về da.',
                'price' => 200000,
            ],
            [
                'name' => 'Khám tim mạch',
                'description' => 'Kiểm tra, chẩn đoán các bệnh liên quan đến tim mạch.',
                'price' => 400000,
            ],
        ]);
    }
}
