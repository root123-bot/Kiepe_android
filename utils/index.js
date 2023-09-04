/*  nishajua jinsi ya kufanya function ya promise iwe executed full... unai-define nje then in useEffect
        una-create another function ambayo kazi yake ni ku-icall hiyo function hadi iishe then ndo una
        i-call kama nilivyofanya hapa..
        MPE HUYU MWANADADA CREDIT KWA KAZI NZURI ALIYOIFANYA KUTUFUNDISHA JINSI YA KU-CACHE ASSETS AND THEN HOW
        TO USE THEM LATER ON, YAANI HAPA UNAWEZA KAMA UKIWEKA AU KU-REQUIRE IMAGE AMBAYO ISHAKUWA CACHED
        THEN AUTOMATICALLY IT WILL BE USED FROM THE CACHE, https://youtu.be/2zWYdPQ7LGY
        Kwa nini image zina-chelewa hata kama loaded locally mpaka tu-cache? kwa sababu in node react-native image
        are loaded in its separate thread, so it takes time to load them, for more read on this article...
        https://stackoverflow.com/questions/47320523/background-image-load-slowly-in-react-native
    */
import { Asset } from "expo-asset";

export const _cacheResourcesAsync = async () => {
  const images = [require("../assets/images/background/2.jpg")];

  const cacheImages = images.map((image) => {
    return Asset.fromModule(image).downloadAsync();
  });

  return Promise.all(cacheImages);
};
