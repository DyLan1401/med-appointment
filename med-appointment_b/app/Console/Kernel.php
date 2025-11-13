protected function schedule(Schedule $schedule)
{
    // chạy tự động mỗi ngày lúc 00:00
    $schedule->command('appointments:remind')->everyMinute();
}
