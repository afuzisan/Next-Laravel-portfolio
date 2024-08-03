import LoginLinks from '@/app/LoginLinks'
import MainContents from '@/app/_RootComponents/MainContents.client'


export const metadata = {
    title: 'Laravel',
}

const Home = () => {
    return (
        <div className="min-h-screen grid grid-cols-10 bg-[url('/TopPageBackground.jpg')] bg-cover bg-center">
            <div className="col-span-2 flex items-center justify-center">
            </div>
            <div className="col-span-6 flex flex-col items-center justify-center text-center p-6">
 
                <MainContents />
            </div>
            <div className="col-span-2 flex items-center justify-center">
            </div>
            <LoginLinks />
        </div>
    )
}

export default Home