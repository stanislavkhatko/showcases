<?php

namespace App\Http\Controllers;

use App\Models\ContentItem;
use App\Models\LocalContentType;
use App\Models\LocalCategory;
use App\Models\Page;
use Illuminate\Http\Request;
use Config;
use Illuminate\Support\Facades\Storage;


class HomeController extends Controller
{
    public function index()
    {
//        return json_decode(Config::get('currentPortal')->config, true);
        return view('pages.home', ['portal' => Config::get('currentPortal')]);
    }

    public function allItems()
    {
        $items = Config::get('currentPortal')->contentItems;

        $search = 'all';

        return view('pages.search', compact('items', 'search'));
    }

    public function showContentType(LocalContentType $localContentType)
    {
        // TODO remove or use somewhere this route

        $contentItems = $localContentType->contentItems;

        $contentItems = $this->paginateCollection($contentItems, 20);

        return view('frontend.contentType.index', compact('localContentType', 'contentItems'));
    }

    public function showCategories(LocalContentType $localContentType)
    {
        return view('pages.categories', compact('localContentType'));
    }

    public function showCategory($id, LocalCategory $localCategory)
    {
        return view('pages.category', compact('localCategory'));
    }

    public function showItem(ContentItem $item)
    {
        $itemUrl = Storage::disk('spaces')->temporaryUrl(
            $item->download['link'], now()->addMinutes(5)
        );

        session(['url.intended' => $item->id]);

        return view('pages.item', compact('item', 'itemUrl'));
    }

    public function playTrial(ContentItem $item)
    {
        return view('pages.play', compact('item'));
    }

    public function playOnline(ContentItem $item)
    {
        return view('pages.play', compact('item'));
    }

    public function downloadItem(ContentItem $item)
    {
        if (session('subscription')) $item->downloadedBy(session('subscription'));

        if ($item->type == 'upload') {
            try {
                return Storage::disk('spaces')->download($item->download['link']);
            } catch (\Exception $e) {
                return redirect()->route('view.contentitem', $item)->with('downloaderror', trans('portal.download_error'));
            }
        } else {
            return $this->showItem($item);
        }
    }

    public function loadContentType(LocalContentType $contentType)
    {
        return $contentType->contentItems()->paginate(15);
    }

    public function viewPage(Page $page)
    {
        // if static route is fetched directly and language is different, change it
        if ($page->lang_code !== \App::getLocale()) {
            \Session::put('locale', $page->lang_code);
            \App::setLocale($page->lang_code);
        }

        return view('pages.page', compact('page'));
    }

    public function changeLocale(Request $request)
    {
        \Session::put('locale', $request->input('locale'));

        // if route is a static page, show homepage
        $url = redirect()->back()->getTargetUrl();
        $url_segments = explode('/', $url);
        if ($url_segments[3] == 'page') return redirect()->route('home');

        return redirect()->back();
    }

    public function exit(Request $request)
    {
        $clickid = subscription('remote_tracking_id');
        $exit = 'portal';
        $redirect = 'exit';

        return redirect()->to($redirect);
    }

    public function search(Request $request)
    {
        $search = strtolower(trim($request->input('search')));

//        $items = Config::get('currentPortal')->contentItems->where('title', $search);
        $items = ContentItem::whereRaw('LOWER(title) LIKE ?', '%' . $search . '%')->limit(14)->get();

        return view('pages.search', compact('items', 'search'));
    }

    private function paginateCollection($items, $per_page)
    {
        $page = \Request::get('page', 1);
        $offset = ($page * $per_page) - $per_page;

        return new \Illuminate\Pagination\LengthAwarePaginator(
            $items->forPage($page, $per_page)->values(),
            $items->count(),
            $per_page,
            \Illuminate\Pagination\Paginator::resolveCurrentPage(),
            ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath()]
        );
    }
}
