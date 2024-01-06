<?php

namespace App\Filters;

use Intervention\Image\Image;
use Intervention\Image\Filters\FilterInterface;

class Fit32 implements FilterInterface
{
    public function applyFilter(Image $image)
    {
        return $image->fit(32)->encode('png');
    }
}