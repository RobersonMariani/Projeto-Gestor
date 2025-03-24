<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Record extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'analyst_id', 'date', 'late', 'absenteeism', 'return_emails',
        'errors_ctes', 'failure_send_occurrences', 'fleet_documentation_failure'
    ];

    public function analyst()
    {
        return $this->belongsTo(Analyst::class);
    }

    public function justification()
    {
        return $this->hasMany(Justification::class);
    }
}
