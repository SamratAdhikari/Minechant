"use client";

import Title from "./_components/Title/page";
import ItemContainer from "./_components/ItemContainer/page";
import EnchantmentContainer from "./_components/EnchantmentContainer/page";
import CalculateButton from "./_components/CalculateButton/page";
import SplashScreen from "./_components/SplashScreen/page";
import { Provider } from "react-redux";
import store from "./redux/store";

export default function Home() {
    return (
        <Provider store={store}>
            <div className="flex flex-col items-center justify-center gap-4 bg-[#305c4c] min-h-screen px-4 sm:px-6">
                <Title />
                <ItemContainer />
                <EnchantmentContainer />
                <CalculateButton />
                <SplashScreen />
            </div>
        </Provider>
    );
}
