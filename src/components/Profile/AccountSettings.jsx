import { useUser } from "../../UserContext";
import { useState, useEffect } from 'react';
import { API_URL } from "../../config";

export default function AccountSettings() {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    display_name: '',
    profile_picture: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        display_name: user.display_name || '',
        profile_picture: user.profile_picture || null,
      });
    }
  }, [user]);

  function getCsrfTokenFromCookie() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    if (formData.username.trim()) {
        data.append('username', formData.username);
    }
    if (formData.display_name.trim()) {
        data.append('display_name', formData.display_name);
    }
    if (formData.profile_picture instanceof File) {
        data.append('profile_picture', formData.profile_picture);
    }

    try {
        const res = await fetch(`${API_URL}/api/auth/update-account/`, {
        method: 'PATCH',
        body: data,
        credentials: 'include',
        headers: {
            'X-CSRFToken': getCsrfTokenFromCookie(),
        },
        });

        const result = await res.json();

        if (!res.ok) {
        console.error('[DEBUG] Error updating user:', result);
        return;
        }

        console.log('[DEBUG] User updated:', result);
        setUser((prev) => ({ ...prev, ...result }));
    } catch (err) {
        console.error('[DEBUG] Network or unexpected error:', err);
    }
    };

  return (
    <div className="w-full flex flex-col mt-20">
      <form className="flex flex-col px-6 gap-2" onSubmit={handleSubmit}>
        <label className="mt-4 mb-2 font-semibold">Profile Picture</label>
        <div className="mb-2">
          <img
            src={
              formData.profile_picture instanceof File
                ? URL.createObjectURL(formData.profile_picture)
                : `${API_URL}${formData.profile_picture}`
            }
            alt=""
            className="w-32 h-32 rounded-full bg-primary object-cover border"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, profile_picture: e.target.files[0] })
          }
          className="p-2 border rounded"
        />

        <label className="font-semibold">Username</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="p-2 border rounded"
        />

        <label className="mt-4 font-semibold">Email</label>
        <input
          disabled
          type="email"
          value={formData.email}
          className="p-2 border rounded bg-gray-100"
        />

        <input
          className="w-1/4 p-2 bg-blue-500 text-white self-end mt-2 cursor-pointer"
          type="submit"
          value="Save"
        />
      </form>
    </div>
  );
}
