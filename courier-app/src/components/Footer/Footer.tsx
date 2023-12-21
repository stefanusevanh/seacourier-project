import { homeRoute } from "@/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaFacebook, FaTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-primary_blue text-[white] mt-4">
      <aside>
        <Link href={homeRoute} className="">
          <Image
            src={"/img/logo.png"}
            alt={"SeaCourier logo"}
            width={100}
            height={100}
            style={{
              filter:
                "brightness(0) saturate(100%) invert(93%) sepia(19%) saturate(4658%) hue-rotate(328deg) brightness(106%) contrast(99%)",
            }}
          />
        </Link>

        <p className="font-bold">
          SeaCourier Ltd. <br />
          Shipping your deliveries since 2023
        </p>
        <p>Copyright © 2023 - All rights reserved</p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <div>
            <FaTwitter size={20} />
          </div>
          <div>
            <FaInstagram size={20} />
          </div>
          <div>
            <FaYoutube size={20} />
          </div>
          <div>
            <FaFacebook size={20} />
          </div>
          <div>
            <FaLinkedin size={20} />
          </div>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
