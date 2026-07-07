import axios from "axios";

export const getCountries = async (req, res) => {
  try {
    const username = process.env.GEONAMES_USERNAME || "vidkk24411e";
    const response = await axios.get(`http://api.geonames.org/countryInfoJSON?username=${username}`);
    
    if (response.data && response.data.geonames) {
      const countries = response.data.geonames.map(c => ({
        countryName: c.countryName,
        geonameId: c.geonameId,
        countryCode: c.countryCode
      }));
      
      // Sort alphabetically by countryName
      countries.sort((a, b) => a.countryName.localeCompare(b.countryName));
      
      return res.status(200).json({ success: true, data: countries });
    } else {
      throw new Error(response.data.status?.message || "Invalid GeoNames API response");
    }
  } catch (error) {
    console.error("Error fetching countries from GeoNames:", error.message);
    // Fallback data
    const fallbackCountries = [
      { countryName: "Vietnam", geonameId: 1562822, countryCode: "VN" },
      { countryName: "United States", geonameId: 6252001, countryCode: "US" },
      { countryName: "Japan", geonameId: 1861060, countryCode: "JP" },
      { countryName: "South Korea", geonameId: 1835841, countryCode: "KR" },
      { countryName: "United Kingdom", geonameId: 2635167, countryCode: "GB" },
      { countryName: "France", geonameId: 3017382, countryCode: "FR" },
      { countryName: "Germany", geonameId: 2921044, countryCode: "DE" }
    ];
    fallbackCountries.sort((a, b) => a.countryName.localeCompare(b.countryName));
    return res.status(200).json({ success: true, data: fallbackCountries, fallback: true });
  }
};

export const getCities = async (req, res) => {
  const { geonameId } = req.params;
  try {
    const username = process.env.GEONAMES_USERNAME || "vidkk24411e";
    const response = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=${username}`);
    
    if (response.data && response.data.geonames) {
      const cities = response.data.geonames.map(c => ({
        name: c.name,
        geonameId: c.geonameId
      }));
      
      // Sort alphabetically by name
      cities.sort((a, b) => a.name.localeCompare(b.name));
      
      return res.status(200).json({ success: true, data: cities });
    } else {
      throw new Error(response.data.status?.message || "Invalid GeoNames API response");
    }
  } catch (error) {
    console.error("Error fetching cities from GeoNames:", error.message);
    
    // Fallback data depending on country geonameId
    let fallbackCities = [];
    if (geonameId === "1562822" || geonameId === 1562822) { // Vietnam
      fallbackCities = [
        { name: "An Giang", geonameId: 1591500 },
        { name: "Ba Ria - Vung Tau", geonameId: 1591142 },
        { name: "Bac Giang", geonameId: 1591527 },
        { name: "Bac Kan", geonameId: 1591538 },
        { name: "Bac Lieu", geonameId: 1591523 },
        { name: "Bac Ninh", geonameId: 1591535 },
        { name: "Ben Tre", geonameId: 1591244 },
        { name: "Binh Dinh", geonameId: 1590928 },
        { name: "Binh Duong", geonameId: 1590911 },
        { name: "Binh Phuoc", geonameId: 1590890 },
        { name: "Binh Thuan", geonameId: 1590825 },
        { name: "Ca Mau", geonameId: 1586414 },
        { name: "Can Tho", geonameId: 1586203 },
        { name: "Cao Bang", geonameId: 1586180 },
        { name: "Da Nang", geonameId: 1583992 },
        { name: "Dak Lak", geonameId: 1584061 },
        { name: "Dak Nong", geonameId: 1584049 },
        { name: "Dien Bien", geonameId: 1583565 },
        { name: "Dong Nai", geonameId: 1582926 },
        { name: "Dong Thap", geonameId: 1582914 },
        { name: "Gia Lai", geonameId: 1581971 },
        { name: "Ha Giang", geonameId: 1581456 },
        { name: "Ha Nam", geonameId: 1581346 },
        { name: "Ha Noi", geonameId: 1581130 },
        { name: "Ha Tinh", geonameId: 1581088 },
        { name: "Hai Duong", geonameId: 1581326 },
        { name: "Hai Phong", geonameId: 1581298 },
        { name: "Hau Giang", geonameId: 1580879 },
        { name: "Ho Chi Minh City", geonameId: 1580578 },
        { name: "Hoa Binh", geonameId: 1580410 },
        { name: "Hung Yen", geonameId: 1580145 },
        { name: "Khanh Hoa", geonameId: 1577901 },
        { name: "Kien Giang", geonameId: 1577884 },
        { name: "Kon Tum", geonameId: 1577579 },
        { name: "Lai Chau", geonameId: 1576628 },
        { name: "Lam Dong", geonameId: 1576612 },
        { name: "Lang Son", geonameId: 1576402 },
        { name: "Lao Cai", geonameId: 1576395 },
        { name: "Long An", geonameId: 1576256 },
        { name: "Nam Dinh", geonameId: 1574345 },
        { name: "Nghe An", geonameId: 1573517 },
        { name: "Ninh Binh", geonameId: 1572015 },
        { name: "Ninh Thuan", geonameId: 1571968 },
        { name: "Phu Tho", geonameId: 1569684 },
        { name: "Phu Yen", geonameId: 1569592 },
        { name: "Quang Binh", geonameId: 1568584 },
        { name: "Quang Nam", geonameId: 1568758 },
        { name: "Quang Ngai", geonameId: 1568738 },
        { name: "Quang Ninh", geonameId: 1568712 },
        { name: "Quang Tri", geonameId: 1568769 },
        { name: "Soc Trang", geonameId: 1567116 },
        { name: "Son La", geonameId: 1566838 },
        { name: "Tay Ninh", geonameId: 1566557 },
        { name: "Thai Binh", geonameId: 1566346 },
        { name: "Thai Nguyen", geonameId: 1566319 },
        { name: "Thanh Hoa", geonameId: 1566166 },
        { name: "Thua Thien Hue", geonameId: 1580240 },
        { name: "Tien Giang", geonameId: 1565088 },
        { name: "Tra Vinh", geonameId: 1563979 },
        { name: "Tuyen Quang", geonameId: 1563281 },
        { name: "Vinh Long", geonameId: 1562693 },
        { name: "Vinh Phuc", geonameId: 1562544 },
        { name: "Yen Bai", geonameId: 1560349 }
      ];
    } else if (geonameId === "6252001" || geonameId === 6252001) { // US states
      fallbackCities = [
        { name: "California", geonameId: 5332921 },
        { name: "New York", geonameId: 5128638 },
        { name: "Texas", geonameId: 4736286 },
        { name: "Florida", geonameId: 4155751 },
        { name: "Illinois", geonameId: 4896861 }
      ];
    } else {
      // General mock cities
      fallbackCities = [
        { name: "Capital City Region", geonameId: 1 },
        { name: "Northern Province", geonameId: 2 },
        { name: "Southern Province", geonameId: 3 },
        { name: "Eastern District", geonameId: 4 },
        { name: "Western Coast", geonameId: 5 }
      ];
    }
    
    // Sort alphabetically by name
    fallbackCities.sort((a, b) => a.name.localeCompare(b.name));
    
    return res.status(200).json({ success: true, data: fallbackCities, fallback: true });
  }
};
