<?php

namespace Database\Factories;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogFactory extends Factory
{
    protected $model = Blog::class;

    public function definition()
    {
        $title = $this->faker->sentence;
        return [
            'posts' => json_encode([
                'title' => $this->faker->sentence,
                'post' => $this->faker->paragraph,
            ]),
            'user_id' => 6, // Create a new user or use an existing one
            'slug' => Str::slug($title) . '-' . Str::random(5),
            
        ];
    }
}

