interface ProfilePictureProps {
  username: string;
  imageUrl: string;
}

export default function ProfilePicture({
  username,
  imageUrl,
}: ProfilePictureProps) {
  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">{username}</h1>
      <img src={imageUrl} className="size-[360px] object-cover mx-auto" />
    </div>
  );
}
