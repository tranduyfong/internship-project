const getElapsedTime = (isoString?: string) => {
    if (!isoString) return 'Vừa xong';

    const now = new Date();
    const past = new Date(isoString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (Number.isNaN(diffInSeconds) || diffInSeconds < 60) return 'Vừa xong';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    return `${Math.floor(diffInHours / 24)} ngày trước`;
};

export default getElapsedTime;