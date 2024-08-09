import Calendar from '@Log/Calendar.client';
const env = (key) => process.env[key] || '';

export const metadata = {
    title: `Log | ${env('SITE_NAME')}`,
    description: `Log |  ${env('SITE_DESCRIPTION')}`,
}
const Log = () => {


  return (
    <div>
        <Calendar />
    </div>

  );
};

export default Log;