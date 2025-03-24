<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Justification extends Model
{
    use HasFactory;

    protected $fillable = ['record_id', 'gestor_id', 'field', 'justification', 'file_path'];

    public function record()
    {
        return $this->belongsTo(Record::class);
    }

    public function gestor()
    {
        return $this->belongsTo(Gestor::class);
    }
}
