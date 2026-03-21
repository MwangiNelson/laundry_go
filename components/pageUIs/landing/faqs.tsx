import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Who is LaundryGo for?",
    answer:
      "LaundryGo is designed for laundry businesses and related home service operators who want to accept local orders, manage pricing, and run daily operations from one dashboard.",
  },
  {
    question: "How does LaundryGo work for partners?",
    answer:
      "Partners create a business profile, choose service categories, set their service areas, and then manage incoming requests through the partner dashboard.",
  },
  {
    question: "How long does it take to become a partner?",
    answer:
      "Most partner setups can be reviewed quickly once the required business details are complete, letting you move from signup to launch without unnecessary delays.",
  },
  {
    question: "How will I receive the orders?",
    answer:
      "The platform tracks orders and payouts so you can monitor completed work, review financial summaries, and keep your team aligned on settled balances.",
  },
];

export function FAQs() {
  return (
    <section id="faqs" className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-title sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mx-auto mt-5 h-2 w-44 rounded-full bg-landing-accent" />
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <Accordion type="single" collapsible defaultValue="item-1">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index + 1}`}
                className="mb-4 px-6"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-title hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-7 text-subtitle sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
