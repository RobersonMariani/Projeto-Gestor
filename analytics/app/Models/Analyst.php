<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Analyst extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'gestor_id'];

    public function gestor()
    {
        return $this->belongsTo(Gestor::class);
    }

    public function records()
    {
        return $this->hasMany(Record::class);
    }

     // Método boot para interceptar a exclusão lógica
     protected static function boot()
     {
         parent::boot();

         static::deleting(function ($analyst) {
             // Desativar logicamente os records vinculados
             $analyst->records()->delete();
         });
     }
}
