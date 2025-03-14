<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
  protected $fillable = ['photo_name'];
  public function blog()
  {
      return $this->belongsTo(Blog::class);
  }
}
