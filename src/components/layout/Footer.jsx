import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { data } from "../../data";

export default function Footer() {
  const {
    title,
    sections,
    buttonTitle,
    buttonContext,
    buttonText,
    inputSubText,
    content,
  } = data.footer;

  return (
    <div className="bg-[#FAFAFA]">
      <div className="mx-auto px-[10%]">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4">
          <h3 className="font-bold text-2xl text-gray-800 my-auto">{title}</h3>
          <div className="text-sky-500 flex gap-3">
            <FontAwesomeIcon icon={faFacebook} size="lg" className="p-1" />
            <FontAwesomeIcon icon={faInstagram} size="lg" className="p-1" />
            <FontAwesomeIcon icon={faTwitter} size="lg" className="p-1" />
          </div>
        </div>
        <hr className="border border-[#E6E6E6]"></hr>
        <div className="flex flex-col gap-5  sm:flex-row justify-between flex-wrap py-5">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col gap-2 ">
              <h5 className="text-gray-800 text-base font-bold ">
                {section.title}
              </h5>
              <div className="flex flex-col gap-2">
                {section.links.map((link, linkIndex) => (
                  <div
                    key={linkIndex}
                    className="text-gray-500 text-sm items-left font-bold no-underline"
                  >
                    {link}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-4">
            <h5 className="text-gray-800 text-base font-bold">{buttonTitle}</h5>
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder={buttonContext}
                  className="p-2.5 border rounded-l-md text-gray-500 font-normal bg-gray-50"
                />
                <button
                  type="submit"
                  className="p-2.5 border border-gray-200 bg-sky-500 text-white rounded-r-md"
                >
                  {buttonText}
                </button>
              </div>
              <p className="text-gray-500 text-xs font-normal mt-1">
                {inputSubText}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 bg-gray-100 collection-text">
        <h6 className="font-bold text-sm text-gray-500 mx-auto px-[10%]">
          {content}
        </h6>
      </div>
    </div>
  );
}
