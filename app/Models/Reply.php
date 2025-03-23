<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reply extends Model
{

    protected $fillable = ['replies', 'comment_id', 'user_id']; 

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }
}
