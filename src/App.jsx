import { useEffect, useState } from "react";
import img1 from "./imgs/istockphoto-642999034-2048x2048.jpg";
import img2 from "./imgs/pexels-photo-3885953.jpeg";
import img3 from "./imgs/pexels-photo-4463896.webp";
import img4 from "./imgs/pexels-photo-6151969.jpeg";
import img5 from "./imgs/pexels-photo-7249178.jpeg";
import BoxesList from "./Components/BoxesList";
import Header from "./Components/Header";
import { cities } from "./Components/dataOfCities";
import axios from "axios";
import moment from "moment";
export default function App() {
  let [selcetedItemFromBox, setSelcetedItemFromBox] = useState("ismailia");
  let [dataOfPrayer, setDataOfPrayer] = useState(null);
  let [boxes, setBoxes] = useState([
    { name: "الفجر", time: "", img: img1 },
    { name: "الظهر", time: "", img: img2 },
    { name: "العصر", time: "", img: img3 },
    { name: "المغرب", time: "", img: img4 },
    { name: "العشاء", time: "", img: img5 },
  ]);
  let [times, setTimes] = useState([]);
  // filter to get the name of selected item
  let filterItemToGetArVal = cities.find((item) => {
    return item.en == selcetedItemFromBox;
  });
  // func to set time in the state
  function updateBoxesWithTimings(timings) {
    const updatedBoxes = boxes.map((box) => {
      switch (box.name) {
        case "الفجر":
          return { ...box, time: timings.Fajr };
        case "الظهر":
          return { ...box, time: timings.Dhuhr };
        case "العصر":
          return { ...box, time: timings.Asr };
        case "المغرب":
          return { ...box, time: timings.Maghrib };
        case "العشاء":
          return { ...box, time: timings.Isha };
        default:
          return box;
      }
      // تعيين الأوقات المحدثة
    });
    setBoxes(updatedBoxes);
  }
  // time from api convert it to mille second
  function convertToMilliseconds(time) {
    // تقسيم الوقت إلى ساعات ودقائق
    let [hours, minutes] = time.split(":").map(Number);

    // تحويل الساعات والدقائق إلى ميلي ثانية
    const hoursInMilliseconds = hours * 60 * 60 * 1000;
    const minutesInMilliseconds = minutes * 60 * 1000;

    // مجموع الميلي ثانية منذ بداية اليوم
    return hoursInMilliseconds + minutesInMilliseconds;
  }
  // time now convert to mille second
  function getCurrentTimeInMilliseconds() {
    const now = new Date();
    // الحصول على الساعات والدقائق الحالية
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // تحويل الساعات إلى ميلي ثانية
    const hoursInMilliseconds = hours * 60 * 60 * 1000;

    // تحويل الدقائق إلى ميلي ثانية
    const minutesInMilliseconds = minutes * 60 * 1000;

    // مجموع الميلي ثانية للساعات والدقائق الحالية
    return hoursInMilliseconds + minutesInMilliseconds;
  }

  function filterTime() {
    let upadtedTime = boxes.map((item) => {
      let hour = Number(item.time.split(":")[0]);
      if (hour < 12) {
        item = {
          ...item,
          time: `${hour + 24}:${item.time.split(":")[1]}`,
        };
      }
      // Convert the updated time to milliseconds
      return {
        ...item,
        time: convertToMilliseconds(item.time) - getCurrentTimeInMilliseconds(),
      };
    });
    // Filter out items with positive time
    let positiveTimes = upadtedTime?.filter((item) => item.time > 0);

    // Find the minimum time from the filtered items
    let minTime = Math.min(...positiveTimes?.map((item) => item.time));
    // Find the item that has the minimum time
    let EndFilter = positiveTimes?.find((item) => item.time === minTime);

    setTimes(EndFilter);
  }
  useEffect(() => {
    filterTime();
  }, [boxes, dataOfPrayer]);
  // func to get timings
  async function getTimings() {
    if (selcetedItemFromBox.trim() === "") return;
    try {
      let result = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity/24-08-2024?city=${selcetedItemFromBox}&country=Egypt&method=8`
      );
      setDataOfPrayer(result?.data?.data.timings);
      updateBoxesWithTimings(result?.data?.data.timings);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getTimings();
  }, [selcetedItemFromBox]);

  return (
    <div className="my-28 sm:my-40 container">
      <Header times={times} arName={filterItemToGetArVal?.ar} />
      <BoxesList boxes={boxes} />
      <div className="flex items-center justify-center">
        <select
          value={selcetedItemFromBox}
          onChange={(e) => setSelcetedItemFromBox(e.target.value)}
          className="w-[200px] hover:w-[220px] transition-all duration-300 rounded-lg bg-[#333] py-1">
          <option disabled={true} value="">
            اختر المدينة
          </option>
          {cities.map((item, index) => {
            return (
              <option key={index} value={item.en}>
                {item.ar}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
