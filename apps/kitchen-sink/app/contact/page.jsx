import { Container, Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@repo/ui';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Acme team.',
};

export default function ContactPage() {
  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Contact Us</h1>
        <p className="text-lg text-neutral-600 mb-12">
          Have questions? We&apos;d love to hear from you.
        </p>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <Card variant="outline" padding="lg" className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4">Talk to our sales team about enterprise solutions.</p>
              <a href="mailto:sales@acme.com" className="text-primary-600 hover:underline">
                sales@acme.com
              </a>
            </CardContent>
          </Card>

          <Card variant="outline" padding="lg" className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4">Get help with technical issues.</p>
              <a href="mailto:support@acme.com" className="text-primary-600 hover:underline">
                support@acme.com
              </a>
            </CardContent>
          </Card>

          <Card variant="outline" padding="lg" className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">Press</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4">Media and press inquiries.</p>
              <a href="mailto:press@acme.com" className="text-primary-600 hover:underline">
                press@acme.com
              </a>
            </CardContent>
          </Card>
        </div>

        <Card variant="filled" padding="xl">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <Button type="submit" size="lg">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
