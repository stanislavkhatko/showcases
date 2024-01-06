@extends('frontend.layouts.app')

@section('content')
    <div class="portal_container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <h2>@lang('portal.cancel_subscription')</h2>
                <p>
                    @lang('portal.cancel_subscription_description')
                </p>
                <div class="row text-center" style="margin-bottom: 25px;">
                    <div class="col-md-6" style="margin-top: 10px">
                        <form method="POST">
                            {{ csrf_field() }}
                            <button type="submit" class="btn btn-lg btn-danger">
                                @lang('portal.cancel_button')
                            </button>
                        </form>
                    </div>
                    <div class="col-md-6 text-center" style="margin-top: 10px">
                        <p>
                            <a href="{{ route('home') }}" class="btn btn-lg btn-success">
                                @lang('portal.continue_button')
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
