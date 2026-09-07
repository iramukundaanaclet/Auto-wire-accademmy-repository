function VideoPlayer({ video }) {
  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
      <iframe
        src={video.embedUrl}
        title={video.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}

export default VideoPlayer
