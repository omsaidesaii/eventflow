import AnimatedStep from './AnimatedStep';
import { Search, Ticket, Sparkles } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      title: 'Discover',
      description: 'Browse through thousands of exciting events happening near you and around the world.'
    },
    {
      icon: Ticket,
      title: 'Book',
      description: 'Secure your spot with our easy and safe booking process. Get instant confirmation.'
    },
    {
      icon: Sparkles,
      title: 'Enjoy',
      description: 'Show up and create unforgettable memories. Your ticket is your gateway to amazing experiences.'
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How EventFlow Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps and unlock a world of amazing events
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <AnimatedStep
              key={step.title}
              icon={step.icon}
              title={step.title}
              description={step.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
