<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnouncementRequest\StoreRequest;
use App\Http\Requests\LibraryRequest\StoreRequest as LibraryRequestStoreRequest;
use App\Http\Requests\LibraryRequest\UpdateRequest;
use App\Services\LibraryService;
use Illuminate\Http\Request;

class LibraryController extends Controller
{
    protected $libraryService;

    public function __construct(LibraryService $libraryService)
    {
        $this->libraryService = $libraryService;
    }

    public function addLibrary(LibraryRequestStoreRequest $request)
    {
     
        // dd($request->all());
        return $this->libraryService->add($request->validated());
    }

    public function updateLibrary(UpdateRequest $request,$id)
    {
        return $this->libraryService->update($request->validated(),$id);
    }

    public function deleteLibrary($id)
    {
        return $this->libraryService->destroy($id);
    }

    public function getLibrary()
    {
        return $this->libraryService->index();
    }
}
