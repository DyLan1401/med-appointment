<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostFeedback extends Model
{
    use HasFactory;

        protected $table = 'post_feedbacks';

    protected $fillable = [
        'post_id',
        'user_id',
        'role',
        'content',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
