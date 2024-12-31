import yt_dlp

def download_video(url, output_path='.'):
    ydl_opts = {
        'format': 'best',  # Choose the best quality format
        'outtmpl': f'{output_path}/%(title)s.%(ext)s',  # Save file with video title as filename
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

if __name__ == "__main__":
    video_url = ''  # Replace with your video URL
    download_video(video_url)
