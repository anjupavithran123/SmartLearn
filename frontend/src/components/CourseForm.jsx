import React from 'react';
import { supabase } from '../supabaseClient';

export default function CourseForm({ course, onClose, onSaved }) {
  const isEdit = Boolean(course);
  const [title, setTitle] = React.useState(course?.title || '');
  const [description, setDescription] = React.useState(course?.description || '');
  const [videoLinks, setVideoLinks] = React.useState(course?.video_links || []);
  const [newVideo, setNewVideo] = React.useState('');
  const [fileUploading, setFileUploading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const addVideoLink = () => {
    if (!newVideo.trim()) return;
    setVideoLinks(prev => [...prev, newVideo.trim()]);
    setNewVideo('');
  };

  const removeLink = (i) => setVideoLinks(prev => prev.filter((_, idx) => idx !== i));

  // Upload file to Supabase Storage (bucket "videos")
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setFileUploading(true);
      setError(null);
      // create unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filename = `${timestamp}-${Math.random().toString(36).slice(2,8)}.${fileExt}`;

      // upload to 'videos' bucket, set public: you can use supabase.storage.from(...).upload
      const { data, error } = await supabase
        .storage
        .from('videos')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // get public URL (if bucket is public) or signed URL
      const { publicURL } = supabase.storage.from('videos').getPublicUrl(data.path);
      // if bucket is private, use createSignedUrl(data.path, expiresInSeconds)
      // const { data: signedData, error: signedErr } = await supabase.storage.from('videos').createSignedUrl(data.path, 60*60);

      setVideoLinks(prev => [...prev, publicURL]);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setFileUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // ensure user is authenticated and get id
      const userResp = await supabase.auth.getUser();
      const user = userResp?.data?.user ?? null;
      if (!user) throw new Error('You must be signed in');

      const payload = {
        title,
        description,
        instructor: user.user_metadata?.full_name || user.email || 'Instructor',
        video_links: videoLinks,
        instructor_id: user.id
      };

      if (isEdit) {
        const { data, error } = await supabase
          .from('courses')
          .update(payload)
          .eq('id', course.id)
          .select()
          .single();

        if (error) throw error;
        onSaved(data);
      } else {
        const { data, error } = await supabase
          .from('courses')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        onSaved(data);
      }
    } catch (err) {
      setError(err.message || 'Save failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-center p-6 z-50">
      <div className="bg-white w-full max-w-2xl rounded p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{isEdit ? 'Edit Course' : 'Create Course'}</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>

        {error && <div className="mb-3 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={4} />
          </div>

          <div>
            <label className="block text-sm">Add video link</label>
            <div className="flex gap-2 mt-2">
              <input value={newVideo} onChange={e => setNewVideo(e.target.value)} placeholder="https://youtube.com/..." className="flex-1 p-2 border rounded" />
              <button type="button" onClick={addVideoLink} className="px-3 py-2 bg-blue-600 text-white rounded">Add</button>
            </div>
            <ul className="mt-2 list-disc ml-5 text-sm">
              {videoLinks.map((v,i) => (
                <li key={i} className="flex justify-between items-center">
                  <a href={v} target="_blank" rel="noreferrer" className="text-blue-600 underline">{v}</a>
                  <button type="button" onClick={() => removeLink(i)} className="text-red-600 ml-3">Remove</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-sm">Or upload video file</label>
            <input type="file" accept="video/*" onChange={handleFileChange} className="mt-2" />
            {fileUploading && <div className="text-sm text-gray-600">Uploading…</div>}
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{isEdit ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
