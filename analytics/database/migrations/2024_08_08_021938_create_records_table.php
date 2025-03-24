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
        Schema::create('records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('analyst_id')->constrained()->onDelete('cascade');
            $table->date('date')->default(now());
            $table->integer('late')->nullable();
            $table->integer('absenteeism')->nullable();
            $table->integer('return_emails')->nullable();
            $table->integer('errors_ctes')->nullable();
            $table->integer('failure_send_occurrences')->nullable();
            $table->integer('fleet_documentation_failure')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('records');
    }
};
