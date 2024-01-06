<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateContentItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('content_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('remote_id')->nullable();
            $table->string('provider');
            $table->json('download')->nullable();
            $table->boolean('is_customized')->default(false);
            $table->unsignedInteger('category_id')->nullable();
            $table->string('type')->default('upload');
            $table->json('title')->nullable();
            $table->json('description')->nullable();
            $table->json('info')->nullable();
            $table->json('compatibility')->nullable();
            $table->string('preview')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('content_items');
    }
}
