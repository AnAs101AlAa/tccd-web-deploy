import { useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaLinkedin, FaGithub } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import toast from "react-hot-toast";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import boardMembers from "@/assets/boardMembers.json";
import websiteFounders from "@/assets/websiteFounders.json";
import type { BoardMember, WebsiteFounder } from "@/shared/types";

// Placeholder image - replace with your actual image path
const ABOUT_US_IMAGE = "/src/assets/defaultAboutUsImage.jpg";
const ABOUT_US_HEADER_IMAGE = "/src/assets/aboutusTopHeader.jpg";

export const AboutUsPage = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const foundersRef = useRef<HTMLDivElement>(null);

    // Contact form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const scrollBoard = (direction: number) => {
        if (carouselRef.current) {
            const scrollAmount = 290;
            const maxScrollLeft = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
            const newScrollLeft = carouselRef.current.scrollLeft + direction * scrollAmount;

            if (newScrollLeft < 0) {
                carouselRef.current.scrollLeft = 0;
            } else if (newScrollLeft > maxScrollLeft) {
                carouselRef.current.scrollLeft = maxScrollLeft;
            } else {
                carouselRef.current.scrollBy({
                    left: direction * scrollAmount,
                    behavior: "smooth",
                });
            }
        }
    };

    const scrollFounders = (direction: number) => {
        if (foundersRef.current) {
            const scrollAmount = 290;
            const maxScrollLeft = foundersRef.current.scrollWidth - foundersRef.current.clientWidth;
            const newScrollLeft = foundersRef.current.scrollLeft + direction * scrollAmount;

            if (newScrollLeft < 0) {
                foundersRef.current.scrollLeft = 0;
            } else if (newScrollLeft > maxScrollLeft) {
                foundersRef.current.scrollLeft = maxScrollLeft;
            } else {
                foundersRef.current.scrollBy({
                    left: direction * scrollAmount,
                    behavior: "smooth",
                });
            }
        }
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(`${type} copied to clipboard!`);
        }).catch(() => {
            toast.error(`Failed to copy ${type}`);
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        // Clear error when user starts typing
        if (errors[id as keyof typeof errors]) {
            setErrors({ ...errors, [id]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = { name: '', email: '', subject: '', message: '' };
        if (!formData.name.trim()) newErrors.name = 'Full Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email Address is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            // For now, just print the form data to console
            console.log('Form Data:', formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Message sent successfully!');

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative font-sans bg-gray-50">
            <UpperHeader
                image={ABOUT_US_HEADER_IMAGE}
                title="About Us"
                subtitle="Catch a brief hint of TCCD, Our vision, mission, and goals, why we do what we do and our teams."
            />

            {/* Board Members Carousel */}
            <div className='mx-auto text-center mt-6 md:mt-12'>
                <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#295E7E] to-[#CD3A38] bg-clip-text text-transparent">
                    Board members
                </h1>
            </div>
            <div className="max-w-7xl mx-auto px-5 relative">
                <button
                    onClick={() => scrollBoard(-1)}
                    className="absolute left-0 lg:-left-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-lg z-10 hover:cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300"
                >
                    <FaArrowLeft className="text-gray-800" />
                </button>
                <button
                    onClick={() => scrollBoard(1)}
                    className="absolute right-0 lg:-right-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-lg z-10 hover:cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300"
                >
                    <FaArrowRight className="text-gray-800" />
                </button>
                <div
                    ref={carouselRef}
                    className="flex overflow-x-scroll snap-x snap-mandatory scroll-smooth gap-6 py-8 px-2 mx-6"
                >
                    {(boardMembers as BoardMember[]).map((member, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-64 bg-white p-6 rounded-xl shadow-md hover:-translate-y-2 transition-transform snap-center"
                        >
                            <img
                                src={member.ImgSrc || ABOUT_US_IMAGE}
                                alt={`${member.Name} - Board Member`}
                                className="w-32 h-32 rounded-full object-cover object-center mx-auto mb-4 bg-gray-200"
                                loading="lazy"
                                onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    if (target.src !== ABOUT_US_IMAGE) {
                                        target.src = ABOUT_US_IMAGE;
                                    }
                                }}
                            />
                            <h3 className="font-semibold text-gray-800 text-center">{member.Name}</h3>
                            <p className="text-gray-600 text-sm text-center">{member.Role}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Website Founders Carousel */}
            <div className='mx-auto text-center mt-6 md:mt-12'>
                <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#295E7E] to-[#CD3A38] bg-clip-text text-transparent">
                    Website Founders
                </h1>
            </div>
            <div className="max-w-7xl mx-auto px-5 relative pb-16">
                <button
                    onClick={() => scrollFounders(-1)}
                    className="absolute left-0 lg:-left-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-lg z-10 hover:cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300"
                >
                    <FaArrowLeft className="text-gray-800" />
                </button>
                <button
                    onClick={() => scrollFounders(1)}
                    className="absolute right-0 lg:-right-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-lg z-10 hover:cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300"
                >
                    <FaArrowRight className="text-gray-800" />
                </button>
                <div
                    ref={foundersRef}
                    className="flex overflow-x-scroll snap-x snap-mandatory scroll-smooth gap-6 py-8 px-2 mx-6"
                >
                    {(websiteFounders as WebsiteFounder[]).map((founder, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-64 bg-white p-6 rounded-xl shadow-md hover:-translate-y-2 transition-transform snap-center"
                        >
                            <img
                                src={founder.ImgSrc || ABOUT_US_IMAGE}
                                alt={`${founder.Name} - Website Founder`}
                                className="w-32 h-32 rounded-full object-cover object-center mx-auto mb-4 bg-gray-200"
                                loading="lazy"
                                onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    if (target.src !== ABOUT_US_IMAGE) {
                                        target.src = ABOUT_US_IMAGE;
                                    }
                                }}
                            />
                            <h3 className="font-semibold text-gray-800 text-center mb-1">{founder.Name}</h3>
                            <p className="text-gray-600 text-sm text-center mb-4">{founder.Role}</p>

                            {/* Contact Icons */}
                            <div className="flex items-center justify-center gap-4 mt-4">
                                {founder.email && (
                                    <button
                                        onClick={() => copyToClipboard(founder.email!, "Email")}
                                        className="w-10 h-10 flex items-center justify-center bg-[#EA4335] text-white rounded-full hover:bg-[#d33426] transition-all hover:scale-110 cursor-pointer shadow-md"
                                        title="Copy email to clipboard"
                                    >
                                        <SiGmail size={18} />
                                    </button>
                                )}
                                {founder.linkedin && (
                                    <a
                                        href={founder.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 flex items-center justify-center bg-[#0077B5] text-white rounded-full hover:bg-[#006396] transition-all hover:scale-110 shadow-md"
                                        title="Open LinkedIn profile"
                                    >
                                        <FaLinkedin size={18} />
                                    </a>
                                )}
                                {founder.github && (
                                    <button
                                        onClick={() => copyToClipboard(founder.github!, "GitHub URL")}
                                        className="w-10 h-10 flex items-center justify-center bg-[#333333] text-white rounded-full hover:bg-[#222222] transition-all hover:scale-110 cursor-pointer shadow-md"
                                        title="Copy GitHub URL to clipboard"
                                    >
                                        <FaGithub size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vision, Mission, Goals Section */}
            <div className="relative py-16 px-5 bg-gradient-to-br from-[#44697E] via-[#5a7a8f] to-[#CD3A38] overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* Vision Section - Text Left, Icon Right on Desktop */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                        {/* Icon - Top on mobile, Right on desktop */}
                        <div className="relative order-1 md:order-2">
                            <div
                                className="w-48 h-48 md:w-56 md:h-56 bg-white/90 flex flex-col items-center justify-center shadow-2xl"
                                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
                            >
                                <svg width="54" height="56" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3">
                                    <path d="M13.0315 0C7.10326 0 2.30883 4.79443 2.30883 10.7227C2.30883 13.5615 3.40816 16.1402 5.205 18.0571L8.00988 14.1712V14.1711C7.334 13.1899 6.93773 12.0016 6.93773 10.7227C6.93773 7.36271 9.67154 4.62891 13.0315 4.62891C13.826 4.62891 14.5856 4.78178 15.2823 5.05969C14.8705 5.41174 14.5398 5.84884 14.3131 6.34092C14.0864 6.833 13.969 7.36836 13.969 7.91016C13.969 8.90472 14.3641 9.85855 15.0673 10.5618C15.7706 11.2651 16.7244 11.6602 17.719 11.6602C18.1874 11.6601 18.6516 11.5724 19.0877 11.4014C18.9742 12.4212 18.6078 13.3658 18.053 14.1711V14.1712L20.858 18.0571C22.6548 16.1402 23.7541 13.5615 23.7541 10.7227C23.7541 4.79443 18.9597 0 13.0315 0ZM13.0315 11.3027L10.5652 12.4332L0 27.0703H2.17699L4.59398 23.8477L3.78832 27.0703H6.67992L10.219 18.2227L9.33422 27.0703H13.9313L13.0315 14.4727L15.731 27.0703H18.5246L15.844 16.3477L20.7648 27.0703H23.1248L21.0069 21.9727L24.8241 27.0703H26.063L15.4978 12.4332L13.0315 11.3027Z" fill="#295E7E" />
                                </svg>
                                <h3 className="text-[#44697E] text-2xl font-bold">Vision</h3>
                            </div>
                        </div>
                        {/* Text - Bottom on mobile, Left on desktop */}
                        <div className="flex-1 text-white md:pr-8 order-2 md:order-1">
                            <p className="text-lg md:text-xl leading-relaxed">
                                Fostering students to pursue rewarding career paths and offering continual learning opportunities to faculty graduates.
                            </p>
                        </div>
                    </div>

                    {/* Mission Section - Icon Left, Text Right on Desktop */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                        {/* Icon - Top on mobile, Left on desktop */}
                        <div className="relative order-1">
                            <div
                                className="w-48 h-48 md:w-56 md:h-56 bg-white/90 flex flex-col items-center justify-center shadow-2xl"
                                style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
                            >
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3">
                                    <path d="M7 9C7.45963 9 7.91475 8.90947 8.33939 8.73358C8.76403 8.55769 9.14987 8.29988 9.47487 7.97487C9.79988 7.64987 10.0577 7.26403 10.2336 6.83939C10.4095 6.41475 10.5 5.95963 10.5 5.5C10.5 5.04037 10.4095 4.58525 10.2336 4.16061C10.0577 3.73597 9.79988 3.35013 9.47487 3.02513C9.14987 2.70012 8.76403 2.44231 8.33939 2.26642C7.91475 2.09053 7.45963 2 7 2C6.07174 2 5.1815 2.36875 4.52513 3.02513C3.86875 3.6815 3.5 4.57174 3.5 5.5C3.5 6.42826 3.86875 7.3185 4.52513 7.97487C5.1815 8.63125 6.07174 9 7 9ZM17 9C17.4596 9 17.9148 8.90947 18.3394 8.73358C18.764 8.55769 19.1499 8.29988 19.4749 7.97487C19.7999 7.64987 20.0577 7.26403 20.2336 6.83939C20.4095 6.41475 20.5 5.95963 20.5 5.5C20.5 5.04037 20.4095 4.58525 20.2336 4.16061C20.0577 3.73597 19.7999 3.35013 19.4749 3.02513C19.1499 2.70012 18.764 2.44231 18.3394 2.26642C17.9148 2.09053 17.4596 2 17 2C16.0717 2 15.1815 2.36875 14.5251 3.02513C13.8687 3.6815 13.5 4.57174 13.5 5.5C13.5 6.42826 13.8687 7.3185 14.5251 7.97487C15.1815 8.63125 16.0717 9 17 9Z" fill="#CD3A38" stroke="#CD3A38" strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M2 22V17.5C2 14.7385 3.885 12.5 6.2105 12.5H8.737C10.7795 12.5 12 14.5135 12 14.5135" stroke="#CD3A38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 22V17.5C22 14.7385 20.0925 12.5 17.7395 12.5H15.183C13.2025 12.5 11.996 14.5135 12 14.5135M5.5 20H19" stroke="#CD3A38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M17.1475 18.129L17.7675 18.7525L19.0075 20L17.7675 21.2805L17.1475 21.921M7.165 18.116L6.535 18.743L5.276 19.9965L6.535 21.2705L7.165 21.908" stroke="#CD3A38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h3 className="text-[#CD3A38] text-2xl font-bold">Mission</h3>
                            </div>
                        </div>
                        {/* Text - Bottom on mobile, Right on desktop */}
                        <div className="flex-1 text-white md:pl-8 order-2">
                            <p className="text-lg md:text-xl leading-relaxed">
                                To empower students and graduates to excel by fostering a supportive environment that address workplace demands and create a lasting positive impact on society.
                            </p>
                        </div>
                    </div>

                    {/* Goals Section - Text Left, Icon Right on Desktop */}
                    <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                        {/* Icon - Top on mobile, Right on desktop */}
                        <div className="relative order-1 md:order-2 mx-auto md:mx-0">
                            <div
                                className="w-48 h-48 md:w-56 md:h-56 bg-white/90 flex flex-col items-center justify-center shadow-2xl"
                                style={{ borderRadius: '70% 30% 50% 50% / 40% 60% 40% 60%' }}
                            >
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3">
                                    <g clipPath="url(#clip0_108_1652)">
                                        <path d="M20.4555 3.5445L22.9695 4.047C23.1045 4.074 23.2155 4.173 23.2545 4.3065C23.2742 4.37135 23.276 4.44032 23.2596 4.50609C23.2432 4.57185 23.2093 4.63195 23.1615 4.68L21.102 6.741C20.8552 6.98639 20.5215 7.1244 20.1735 7.125H18.465L14.175 11.4165C14.2568 11.7255 14.2719 12.0485 14.2192 12.3638C14.1664 12.6791 14.0471 12.9795 13.8691 13.2451C13.6911 13.5107 13.4586 13.7353 13.1871 13.9039C12.9155 14.0726 12.6111 14.1814 12.2941 14.2232C11.9772 14.265 11.655 14.2388 11.349 14.1463C11.043 14.0538 10.7602 13.8971 10.5194 13.6868C10.2787 13.4764 10.0856 13.2172 9.95291 12.9263C9.82023 12.6355 9.75106 12.3197 9.75 12C9.74993 11.6547 9.82931 11.3141 9.98201 11.0044C10.1347 10.6948 10.3566 10.4244 10.6306 10.2143C10.9045 10.0041 11.2232 9.85984 11.5618 9.7926C11.9005 9.72536 12.25 9.73696 12.5835 9.8265L16.875 5.53349V3.828C16.875 3.48 17.013 3.1455 17.259 2.8995L19.32 0.838495C19.368 0.790689 19.4281 0.756796 19.4939 0.74042C19.5597 0.724044 19.6286 0.725798 19.6935 0.745495C19.827 0.784495 19.926 0.895495 19.953 1.0305L20.4555 3.5445Z" fill="#295E7E" />
                                        <path d="M3.00004 12C3.00158 13.2869 3.2791 14.5586 3.81389 15.7292C4.34868 16.8997 5.12829 17.942 6.10013 18.7856C7.07197 19.6293 8.21344 20.2547 9.44754 20.6197C10.6816 20.9847 11.9797 21.0807 13.2541 20.9014C14.5284 20.7221 15.7496 20.2716 16.835 19.5802C17.9205 18.8888 18.845 17.9727 19.5463 16.8936C20.2476 15.8146 20.7094 14.5976 20.9004 13.3249C21.0914 12.0523 21.0072 10.7534 20.6535 9.516C20.6039 9.37144 20.5842 9.21828 20.5956 9.06585C20.607 8.91343 20.6494 8.76492 20.72 8.62937C20.7907 8.49383 20.8882 8.37408 21.0066 8.27742C21.125 8.18076 21.2618 8.1092 21.4088 8.06712C21.5557 8.02503 21.7097 8.01329 21.8613 8.03261C22.013 8.05193 22.1591 8.10191 22.2908 8.1795C22.4225 8.25709 22.537 8.36067 22.6274 8.48393C22.7178 8.6072 22.7821 8.74757 22.8165 8.89651C23.5013 11.2928 23.3712 13.8486 22.4467 16.163C21.5222 18.4774 19.8555 20.4194 17.7082 21.6843C15.5608 22.9492 13.0543 23.4655 10.5819 23.1522C8.10942 22.8389 5.81095 21.7136 4.04704 19.953C2.28505 18.1895 1.1586 15.8908 0.844545 13.4178C0.530488 10.9448 1.04661 8.43753 2.31187 6.28961C3.57714 4.1417 5.5199 2.4748 7.83513 1.55062C10.1504 0.626433 12.707 0.497305 15.1035 1.18351C15.3889 1.26692 15.6296 1.45991 15.7731 1.72028C15.9167 1.98066 15.9513 2.28726 15.8694 2.57307C15.7875 2.85888 15.5959 3.10067 15.3363 3.2456C15.0767 3.39053 14.7703 3.4268 14.484 3.3465C13.1439 2.96168 11.7327 2.89349 10.3617 3.14731C8.99066 3.40113 7.69738 3.97002 6.58383 4.80911C5.47028 5.6482 4.56691 6.73454 3.94498 7.98245C3.32305 9.23036 2.99956 10.6057 3.00004 12Z" fill="#295E7E" />
                                        <path d="M7.49998 12C7.50007 12.8199 7.72401 13.6242 8.14763 14.3262C8.57125 15.0281 9.17849 15.6011 9.90384 15.9833C10.6292 16.3655 11.4451 16.5424 12.2636 16.495C13.0821 16.4475 13.8722 16.1775 14.5485 15.714C15.2247 15.2494 15.761 14.6087 16.0994 13.8613C16.4378 13.1139 16.5654 12.2882 16.4685 11.4735C16.4423 11.2758 16.4692 11.0747 16.5466 10.8909C16.6239 10.7071 16.7488 10.5472 16.9085 10.4277C17.0682 10.3082 17.2568 10.2334 17.455 10.2111C17.6532 10.1887 17.8537 10.2196 18.036 10.3005C18.2182 10.3804 18.376 10.5071 18.4933 10.6679C18.6105 10.8286 18.6831 11.0176 18.7035 11.2155C18.8665 12.6077 18.592 14.016 17.9183 15.2451C17.2445 16.4742 16.2048 17.4631 14.9435 18.0744C13.6822 18.6858 12.2619 18.8894 10.8796 18.6569C9.49739 18.4244 8.2218 17.7674 7.22993 16.777C6.23805 15.7866 5.57909 14.512 5.34449 13.1302C5.10989 11.7483 5.3113 10.3276 5.92076 9.06541C6.53022 7.80319 7.51751 6.762 8.74558 6.08636C9.97365 5.41072 11.3816 5.13414 12.774 5.29501C12.9231 5.30884 13.0679 5.3523 13.2 5.42283C13.3321 5.49336 13.4487 5.58955 13.5432 5.70576C13.6376 5.82197 13.7079 5.95586 13.7499 6.09958C13.7919 6.2433 13.8048 6.39396 13.7878 6.54272C13.7708 6.69149 13.7243 6.83538 13.651 6.96594C13.5777 7.0965 13.4791 7.21112 13.3609 7.30307C13.2427 7.39502 13.1074 7.46246 12.9628 7.50143C12.8183 7.5404 12.6674 7.55011 12.519 7.53001C11.8885 7.4568 11.2496 7.51781 10.6443 7.70903C10.0391 7.90025 9.48112 8.21736 9.00711 8.63952C8.5331 9.06168 8.15376 9.57935 7.89401 10.1585C7.63426 10.7377 7.49998 11.3653 7.49998 12Z" fill="#295E7E" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_108_1652">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <h3 className="text-[#44697E] text-2xl font-bold">Goals</h3>
                            </div>
                        </div>
                        {/* Text - Bottom on mobile, Left on desktop */}
                        <div className="flex-1 text-white order-2 md:order-1">
                            <ul className="space-y-3 list-none">
                                <li className="flex items-start">
                                    <span className="mr-3 mt-1">•</span>
                                    <span className="text-base md:text-lg">Provide quality services and training to boost employability</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 mt-1">•</span>
                                    <span className="text-base md:text-lg">Partner with public and private entities to support initiatives</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 mt-1">•</span>
                                    <span className="text-base md:text-lg">Develop career services to improve employability</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 mt-1">•</span>
                                    <span className="text-base md:text-lg">Launch initiatives to serve TCCD stakeholders and partners</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 mt-1">•</span>
                                    <span className="text-base md:text-lg">Strengthen TCCD's network and resources</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 mt-1">•</span>
                                    <span className="text-base md:text-lg">Generate revenue for sustainability and growth</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <section className="bg-gradient-to-br from-gray-50 to-white py-16 px-5">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#295E7E] to-[#CD3A38] bg-clip-text text-transparent mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-[#295E7E]">
                            We'd love to hear from you! Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="relative">
                                <input
                                    id="name"
                                    type="text"
                                    className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg peer focus:outline-none focus:border-[#295E7E] transition-colors`}
                                    placeholder=" "
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="name"
                                    className={`absolute left-4 ${formData.name ? "-top-3" : "top-3"} px-1 text-gray-400 transition-all peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[#295E7E] bg-white text-sm`}
                                >
                                    Full Name
                                </label>
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg peer focus:outline-none focus:border-[#295E7E] transition-colors`}
                                    placeholder=" "
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="email"
                                    className={`absolute left-4 ${formData.email ? "-top-3" : "top-3"} px-1 text-gray-400 transition-all peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[#295E7E] bg-white text-sm`}
                                >
                                    Email Address
                                </label>
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                id="subject"
                                type="text"
                                className={`w-full px-4 py-3 border-2 ${errors.subject ? 'border-red-500' : 'border-gray-200'} rounded-lg peer focus:outline-none focus:border-[#295E7E] transition-colors`}
                                placeholder=" "
                                value={formData.subject}
                                onChange={handleChange}
                            />
                            <label
                                htmlFor="subject"
                                className={`absolute left-4 ${formData.subject ? "-top-3" : "top-3"} px-1 text-gray-400 transition-all peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[#295E7E] bg-white text-sm`}
                            >
                                Subject
                            </label>
                            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                        </div>

                        <div className="relative">
                            <textarea
                                id="message"
                                rows={6}
                                className={`w-full px-4 py-3 border-2 ${errors.message ? 'border-red-500' : 'border-gray-200'} rounded-lg peer resize-none focus:outline-none focus:border-[#295E7E] transition-colors`}
                                placeholder=" "
                                value={formData.message}
                                onChange={handleChange}
                            />
                            <label
                                htmlFor="message"
                                className={`absolute left-4 ${formData.message ? "-top-3" : "top-3"} px-1 text-gray-400 transition-all peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[#295E7E] bg-white text-sm`}
                            >
                                Your Message
                            </label>
                            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-4 bg-gradient-to-r transition-all duration-300 cursor-pointer from-[#295E7E] to-[#CD3A38] text-white rounded-full font-semibold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};
