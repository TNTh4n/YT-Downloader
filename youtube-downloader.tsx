import React, { useState } from 'react';
import { Download, Trash2, Plus, AlertCircle } from 'lucide-react';

export default function YouTubeDownloader() {
  const [urls, setUrls] = useState(['']);
  const [downloads, setDownloads] = useState([]);
  const [error, setError] = useState('');

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls.length === 0 ? [''] : newUrls);
  };

  const updateUrl = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const handleDownload = async () => {
    setError('');
    const validUrls = urls.filter(url => url.trim() !== '');
    
    if (validUrls.length === 0) {
      setError('Please enter at least one YouTube URL');
      return;
    }

    const newDownloads = [];
    
    for (const url of validUrls) {
      const videoId = extractVideoId(url);
      
      if (!videoId) {
        setError(`Invalid YouTube URL: ${url}`);
        continue;
      }

      // Using a third-party service for downloading
      // Note: This uses yt1s.com API as an example
      const downloadUrl = `https://www.yt1s.com/api/ajaxSearch/download`;
      
      newDownloads.push({
        id: videoId,
        url: url,
        status: 'ready',
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        downloadLink: `https://www.y2mate.com/youtube/${videoId}`
      });
    }

    setDownloads([...downloads, ...newDownloads]);
    setUrls(['']);
  };

  const removeDownload = (id) => {
    setDownloads(downloads.filter(d => d.id !== id));
  };

  const clearAll = () => {
    setDownloads([]);
    setUrls(['']);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-800">YouTube Batch Downloader</h1>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Enter YouTube video URLs below. You can add multiple videos to download them in batch.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-3 mb-4">
              {urls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {urls.length > 1 && (
                    <button
                      onClick={() => removeUrlField(index)}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={addUrlField}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add URL
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                Prepare Downloads
              </button>
            </div>
          </div>

          {downloads.length > 0 && (
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Download Queue ({downloads.length})
                </h2>
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                {downloads.map((download) => (
                  <div
                    key={download.id}
                    className="bg-gray-50 rounded-lg p-4 flex items-center gap-4"
                  >
                    <img
                      src={download.thumbnail}
                      alt="Video thumbnail"
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {download.url}
                      </p>
                      <p className="text-xs text-gray-500">
                        Video ID: {download.id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={download.downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => removeDownload(download.id)}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This app prepares your downloads and redirects you to a third-party service (Y2Mate) 
              to complete the download. Due to browser security restrictions, direct downloading requires external services. 
              Make sure to respect YouTube's Terms of Service and copyright laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}