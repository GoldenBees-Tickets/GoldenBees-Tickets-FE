export default function ListContent (){
    return (
        <>
        <div>
    <h2 className="mb-1 text-2xl font-semibold">Leads</h2>
    <h3 className="mb-8 text-sm font-medium text-slate-600">
      You have 10 new leads, let's get to work!
    </h3>
    {/* Responsive Table Container */}
    <div className="min-w-full overflow-x-auto rounded">
      {/* Alternate Responsive Table */}
      <table className="min-w-full align-middle text-sm">
        {/* Table Header */}
        <thead>
          <tr className="border-b-2 border-slate-100">
            <th className="min-w-[180px] py-3 pe-3 text-start text-sm font-semibold uppercase tracking-wider text-slate-700">
              Company
            </th>
            <th className="min-w-[180px] px-3 py-2 text-start text-sm font-semibold uppercase tracking-wider text-slate-700">
              Industry
            </th>
            <th className="min-w-[180px] px-3 py-2 text-start text-sm font-semibold uppercase tracking-wider text-slate-700">
              Location
            </th>
            <th className="px-3 py-2 text-start text-sm font-semibold uppercase tracking-wider text-slate-700">
              Funding
            </th>
            <th className="px-3 py-2 text-start text-sm font-semibold uppercase tracking-wider text-slate-700">
              Contact
            </th>
            <th className="min-w-[180px] py-2 ps-3 text-start text-sm font-semibold uppercase tracking-wider text-slate-700">
              Actions
            </th>
          </tr>
        </thead>
        {/* END Table Header */}
        {/* Table Body */}
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="py-3 pe-3 text-start">
              <a
                
                className="font-medium text-indigo-500 hover:text-indigo-700"
              >
                Acme Inc.
              </a>
            </td>
            <td className="p-3 text-slate-600">Manufacturing</td>
            <td className="p-3 font-medium">Chicago, IL</td>
            <td className="p-3 text-start">
              <div className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold leading-4 text-emerald-800">
                $10M
              </div>
            </td>
            <td className="p-3 font-medium">john.smith@acmeinc.com</td>
            <td className="py-3 ps-3 font-medium">
              <a
                
                className="group inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 font-medium text-slate-800 transition duration-75 hover:border-indigo-300 hover:text-indigo-800 active:border-slate-200"
              >
                <span>Send Message</span>
                <svg
                  className="hi-mini hi-arrow-right inline-block h-5 w-5 text-slate-400 transition duration-75 group-hover:text-indigo-600 group-active:translate-x-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </td>
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-700/50">
            <td className="py-3 pe-3 text-start">
              <a
                
                className="font-medium text-indigo-500 hover:text-indigo-700"
              >
                XYZ Corporation
              </a>
            </td>
            <td className="p-3 text-slate-600">Technology</td>
            <td className="p-3 font-medium">San Francisco, CA</td>
            <td className="p-3 text-start">
              <div className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold leading-4 text-emerald-800">
                $50M
              </div>
            </td>
            <td className="p-3 font-medium">jane.doe@xyzcorp.com</td>
            <td className="py-3 ps-3 font-medium">
              <a
                
                className="group inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 font-medium text-slate-800 transition duration-75 hover:border-indigo-300 hover:text-indigo-800 active:border-slate-200"
              >
                <span>Send Message</span>
                <svg
                  className="hi-mini hi-arrow-right inline-block h-5 w-5 text-slate-400 transition duration-75 group-hover:text-indigo-600 group-active:translate-x-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </td>
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-700/50">
            <td className="py-3 pe-3 text-start">
              <a
                
                className="font-medium text-indigo-500 hover:text-indigo-700"
              >
                Smith &amp; Associates
              </a>
            </td>
            <td className="p-3 text-slate-600">Consulting</td>
            <td className="p-3 font-medium">New York, NY</td>
            <td className="p-3 text-start">
              <div className="inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold leading-4 text-purple-800">
                $5M
              </div>
            </td>
            <td className="p-3 font-medium">david.lee@smithandassoc.com</td>
            <td className="py-3 ps-3 font-medium">
              <a
                
                className="group inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 font-medium text-slate-800 transition duration-75 hover:border-indigo-300 hover:text-indigo-800 active:border-slate-200"
              >
                <span>Send Message</span>
                <svg
                  className="hi-mini hi-arrow-right inline-block h-5 w-5 text-slate-400 transition duration-75 group-hover:text-indigo-600 group-active:translate-x-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </td>
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-700/50">
            <td className="py-3 pe-3 text-start">
              <a
                
                className="font-medium text-indigo-500 hover:text-indigo-700"
              >
                Global Foods Ltd.
              </a>
            </td>
            <td className="p-3 text-slate-600">Food and Beverage</td>
            <td className="p-3 font-medium">London UK</td>
            <td className="p-3 text-start">
              <div className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold leading-4 text-emerald-800">
                $20M
              </div>
            </td>
            <td className="p-3 font-medium">maria.rodriguez@globalfoods.com</td>
            <td className="py-3 ps-3 font-medium">
              <a
                
                className="group inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 font-medium text-slate-800 transition duration-75 hover:border-indigo-300 hover:text-indigo-800 active:border-slate-200"
              >
                <span>Send Message</span>
                <svg
                  className="hi-mini hi-arrow-right inline-block h-5 w-5 text-slate-400 transition duration-75 group-hover:text-indigo-600 group-active:translate-x-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </td>
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-700/50">
            <td className="py-3 pe-3 text-start">
              <a
                
                className="font-medium text-indigo-500 hover:text-indigo-700"
              >
                Elite Fitness
              </a>
            </td>
            <td className="p-3 text-slate-600">Health and Wellness</td>
            <td className="p-3 font-medium">Los Angeles, CA</td>
            <td className="p-3 text-start">
              <div className="inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold leading-4 text-purple-800">
                $2M
              </div>
            </td>
            <td className="p-3 font-medium">sarah.johnson@elitefitness.com</td>
            <td className="py-3 ps-3 font-medium">
              <a
                
                className="group inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 font-medium text-slate-800 transition duration-75 hover:border-indigo-300 hover:text-indigo-800 active:border-slate-200"
              >
                <span>Send Message</span>
                <svg
                  className="hi-mini hi-arrow-right inline-block h-5 w-5 text-slate-400 transition duration-75 group-hover:text-indigo-600 group-active:translate-x-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </td>
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-700/50">
            <td className="py-3 pe-3 text-start">
              <a
                
                className="font-medium text-indigo-500 hover:text-indigo-700"
              >
                Sparkle Inc.
              </a>
            </td>
            <td className="p-3 text-slate-600">Cosmetics</td>
            <td className="p-3 font-medium">Paris, France</td>
            <td className="p-3 text-start">
              <div className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold leading-4 text-emerald-800">
                $15M
              </div>
            </td>
            <td className="p-3 font-medium">julie.duval@sparkleinc.com</td>
            <td className="py-3 ps-3 font-medium">
              <a
                
                className="group inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 font-medium text-slate-800 transition duration-75 hover:border-indigo-300 hover:text-indigo-800 active:border-slate-200"
              >
                <span>Send Message</span>
                <svg
                  className="hi-mini hi-arrow-right inline-block h-5 w-5 text-slate-400 transition duration-75 group-hover:text-indigo-600 group-active:translate-x-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </td>
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-700/50">
            <td className="py-3 pe-3 text-start">
              <a
                
                className="font-medium text-indigo-500 hover:text-indigo-700"
              >
                SolarTech
              </a>
            </td>
            <td className="p-3 text-slate-600">Renewable Energy</td>
            <td className="p-3 font-medium">Austin, TX</td>
            <td className="p-3 text-start">
              <div className="inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold leading-4 text-purple-800">
                $8M
              </div>
            </td>
            <td className="p-3 font-medium">andrew.kim@solartech.com</td>
            <td className="py-3 ps-3 font-medium">
              <a
                
                className="group inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 font-medium text-slate-800 transition duration-75 hover:border-indigo-300 hover:text-indigo-800 active:border-slate-200"
              >
                <span>Send Message</span>
                <svg
                  className="hi-mini hi-arrow-right inline-block h-5 w-5 text-slate-400 transition duration-75 group-hover:text-indigo-600 group-active:translate-x-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </td>
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-700/50">
            <td className="py-3 pe-3 text-start">
              <a
                
                className="font-medium text-indigo-500 hover:text-indigo-700"
              >
                Zenith Co.
              </a>
            </td>
            <td className="p-3 text-slate-600">Finance</td>
            <td className="p-3 font-medium">Hong Kong, China</td>
            <td className="p-3 text-start">
              <div className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold leading-4 text-emerald-800">
                $30M
              </div>
            </td>
            <td className="p-3 font-medium">david.chen@zenithco.com</td>
            <td className="py-3 ps-3 font-medium">
              <a
                
                className="group inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 font-medium text-slate-800 transition duration-75 hover:border-indigo-300 hover:text-indigo-800 active:border-slate-200"
              >
                <span>Send Message</span>
                <svg
                  className="hi-mini hi-arrow-right inline-block h-5 w-5 text-slate-400 transition duration-75 group-hover:text-indigo-600 group-active:translate-x-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </td>
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-700/50">
            <td className="py-3 pe-3 text-start">
              <a
                
                className="font-medium text-indigo-500 hover:text-indigo-700"
              >
                Bright Solutions
              </a>
            </td>
            <td className="p-3 text-slate-600">IT Services</td>
            <td className="p-3 font-medium">Bangalore, India</td>
            <td className="p-3 text-start">
              <div className="inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold leading-4 text-purple-800">
                $12M
              </div>
            </td>
            <td className="p-3 font-medium">
              priya.sharma@brightsolutions.com
            </td>
            <td className="py-3 ps-3 font-medium">
              <a
                
                className="group inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 font-medium text-slate-800 transition duration-75 hover:border-indigo-300 hover:text-indigo-800 active:border-slate-200"
              >
                <span>Send Message</span>
                <svg
                  className="hi-mini hi-arrow-right inline-block h-5 w-5 text-slate-400 transition duration-75 group-hover:text-indigo-600 group-active:translate-x-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </td>
          </tr>
          <tr className="border-b border-gray-100 dark:border-slate-700/50">
            <td className="py-3 pe-3 text-start">
              <a
                
                className="font-medium text-indigo-500 hover:text-indigo-700"
              >
                Green Growth
              </a>
            </td>
            <td className="p-3 text-slate-600">Agriculture</td>
            <td className="p-3 font-medium">Cape Town, South Africa</td>
            <td className="p-3 text-start">
              <div className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold leading-4 text-emerald-800">
                $3M
              </div>
            </td>
            <td className="p-3 font-medium">samuel.mbatha@greengrowth.com</td>
            <td className="py-3 ps-3 font-medium">
              <a
                
                className="group inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 font-medium text-slate-800 transition duration-75 hover:border-indigo-300 hover:text-indigo-800 active:border-slate-200"
              >
                <span>Send Message</span>
                <svg
                  className="hi-mini hi-arrow-right inline-block h-5 w-5 text-slate-400 transition duration-75 group-hover:text-indigo-600 group-active:translate-x-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </td>
          </tr>
        </tbody>
        {/* END Table Body */}
      </table>
      {/* END Alternate Responsive Table */}
    </div>
    {/* END Responsive Table Container */}
  </div>
        </>
    )
}