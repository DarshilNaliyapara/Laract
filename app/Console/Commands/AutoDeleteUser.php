<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class AutoDeleteUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:autodelete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "This will auto delete users when they don't verify email within 1 hour";

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $deletedUsers = User::whereNull('email_verified_at')->delete();

        // Output the result to the console
        $this->info("Deleted {$deletedUsers} users who have not verified their email.");
    }
}
