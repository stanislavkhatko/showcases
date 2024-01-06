<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Cookie;
use Carbon\Carbon;

class AuthController extends Controller {
	/**
	 * Show login form.
	 *
	 * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
	 */
	public function show() {
		return view( 'pages.login' );
	}

	/**
	 * Authenticate based on the Payment API SDK.
	 */
	public function login( Request $request ) {
		return $this->validateMsisdn( $request );
	}


	public function challenge( $token ) {
		[ $id, $remoteId ] = explode( '-', $token, 2 );
		$client = new \App\Subsyz\Client();
		$result = $client->validateSubscription( $id, $remoteId );

		if ( $result->success == 'true' ) {
			\Cookie::queue( cookie( 'subscription', [
				'subscription' => [
					'msisdn'             => $result->msisdn,
					'status'             => $result->status,
					'remote_tracking_id' => $result->remote_tracking_id,
					'subscription_id'    => $result->subscription,
					'offer_id'           => $result->offer_id,
					'operator'           => $result->operator,
					'confirmed_at'       => $result->confirmed_at->date ?? Carbon::now(),
					'closed_at'          => $result->closed_at,
				]
			] ) );

			session( [
				'subscription' => [
					'msisdn'          => $result->msisdn ?? '',
					'subscription_id' => $result->subscription,
				]
			] );

			return redirect()->route( 'home' );
		} else {
			return response( 'No valid subscription', 422 );
		}
	}

	public function cancelSubscription() {
		return view( 'pages.subscription-cancel' );
	}

	private function redirectToPortal() {
		if ( session()->has( 'url.intended' ) ) {
			return redirect()->route( 'view.contentitem', session( 'url.intended' ) );
		} else {
			return redirect()->route( 'home' );
		}
	}

	public function validateMsisdn( Request $request, $msisdn = null ) {

		$phoneNumber = $request->input( 'msisdn' );
		$phoneCode   = preg_replace( '/[^0-9.]+/', '', $request->input( 'phonecode' ) );

		if ( !$msisdn ) {
			$msisdn = substr( $phoneNumber, 0, strlen($phoneCode)) !== $phoneCode ? $phoneCode . $phoneNumber : $phoneNumber;
		}

		if ( $phoneNumber == env( 'TEST_NUMBER' ) ) {
			session( [
				'subscription' => [
					'msisdn'          => env( 'TEST_NUMBER' ),
					'subscription_id' => 1,
				]
			] );

			return $this->redirectToPortal();
		}

		$client = new \App\Subsyz\Client();
		$result = $client->validateMsisdn( $msisdn );

		if ( $result && $result->subscription ) {
			session( [
				'subscription' => [
					'msisdn'          => $result->subscription->msisdn,
					'subscription_id' => $result->subscription->subscription_id,
				]
			] );

			return $this->redirectToPortal();
		}

		if ( $result && $result->subscribe ) {

			$shortcode = $result->subscribe->shortcode;
			$keyword   = $result->subscribe->keyword;
			$sms       = 'sms:' . $shortcode . ';?&body=' . $keyword;

			$agent = new \Jenssegers\Agent\Agent();
			if ( $agent->isDesktop() ) {
				$sms = '';
			}

			$subscribe = [
				'shortcode' => $shortcode,
				'keyword'   => $keyword,
				'sms'       => $sms,
				'price'     => $result->subscribe->price,
				'currency'  => $result->subscribe->currency
			];

			return redirect( '/authenticate' )->with( [
				'subscribe' => $subscribe
			] )->withInput( [ 'msisdn' => $phoneNumber ] );

		} else if ( $result && $result->error ) {
			return redirect( '/authenticate' )->with( [ 'error' => trans( 'portal.' . $result->error ) ] )->withInput( [ 'msisdn' => $phoneNumber ] );
		}

		return redirect( '/authenticate' )->with( [ 'error' => 'Something wrong with server' ] )->withInput( [ 'msisdn' => $phoneNumber ] );
	}

	public function unsubscribe( Request $request ) {
		$client = new \App\Subsyz\Client();
		$result = $client->unsubscribe( session( 'subscription' )['subscription_id'] );

		if ( $result->success ) {
			return view( 'pages.subscription-canceled' );
		} else {
			return redirect()->route( 'home' );
		}

	}
}
