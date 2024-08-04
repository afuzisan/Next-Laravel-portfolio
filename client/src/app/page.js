import LoginLinks from '@/app/LoginLinks'
import MainContents from '@/app/_RootComponents/MainContents.client'


export const metadata = {
    title: 'Laravel',
}

const Home = () => {
    return (
        <>
            <MainContents />
            <LoginLinks />
        </>

    )
}

export default Home