import React from 'react';
import './homePage.scss';
import SearchForm from './Form';
import Navbar from './Navbar';

function HomePage() {
    return (
        <div className='homePage'>
            <Navbar />
            <div className='textContainer'>
                <div className="wrapper">
                    <h1 className='title'>
                        "Twój Przewodnik Po Wynajmie Mieszkania: Szukaj i Znajduj z Łatwością!"
                    </h1>
                    <p>
                    Odkryj prostszy sposób na wynajem mieszkania dzięki naszej wyspecjalizowanej platformie. Pomagamy na każdym etapie procesu, abyś szybko znalazł
                     swoje wymarzone miejsce do życia. Z nami wynajem mieszkania stanie się łatwiejszy niż kiedykolwiek wcześniej!
                    </p>
                    <SearchForm/>
                    <div className="boxes">
                        <div className="box">
                            <h1>100+</h1>
                            <h2>Zadowolonych klientów</h2>
                        </div>
                        <div className="box">
                            <h1>1</h1>
                            <h2>rok działania</h2>
                        </div>
                        <div className="box">
                            <h1>3+</h1>
                            <h2>pobrane witryny</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className='imgContainer'>
                <img src="/bg.png" alt="" />
            </div>
        </div>
    );
}

export default HomePage;