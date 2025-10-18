<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryPost extends Model
{
    use HasFactory;

    protected $table = 'categories_post';

    protected $fillable = ['name', 'description'];

    public function posts()
    {
        return $this->hasMany(Post::class, 'category_id');
    }
}
