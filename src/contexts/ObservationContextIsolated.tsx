import { UseCamera } from "@/hooks/useCamera";

export const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => { 
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}
export const getLocationInfo = (images: UseCamera[]) => {
    const location = {radius: -1} as {latitude: number, longitude: number, radius: number};
    const centroid = images.reduce((acc, image) => {
        acc.latitude += image?.current?.exif?.GPSLatitude;
        acc.longitude += image?.current?.exif?.GPSLongitude;
        return acc;
    }, { latitude: 0, longitude: 0 });
    
    location.latitude = centroid.latitude / images.length;
    location.longitude = centroid.longitude / images.length;

    //if there is more than one location, need to calculate radius
    if (images.length > 1) {
        const radius = images.reduce((maxDistance, image) => {
            const distance = haversineDistance(
                location.latitude, location.longitude,
                image?.current?.exif?.GPSLatitude, image?.current?.exif?.GPSLongitude
            );
            return Math.max(maxDistance, distance);
        }, 0);
        location.radius = radius
    }
    return location;
}

export const getMostRecentTimestamp = (images: UseCamera[]): Date => {
    return images
      .map(image => new Date(image.current?.exif?.timestamp))
      .reduce((mostRecent, current) => current < mostRecent ? current : mostRecent);
}