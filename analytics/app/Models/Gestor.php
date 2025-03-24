<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gestor extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'user_id'];

    public function analysts()
    {
        return $this->hasMany(Analyst::class);
    }
}
