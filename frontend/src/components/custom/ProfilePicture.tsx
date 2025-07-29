interface ProfilePictureProps {
  username: string;
  imageUrl: string;
}

export default function ProfilePicture({ username, imageUrl }: ProfilePictureProps) {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">{username}</h1>
      <img src={imageUrl} className="mx-auto size-[360px] object-cover" />
    </div>
  );
}
