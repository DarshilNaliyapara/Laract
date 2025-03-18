<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Tracks which user liked the post
            $table->foreignId('blog_id')->constrained()->onDelete('cascade'); // Tracks which post was liked
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
