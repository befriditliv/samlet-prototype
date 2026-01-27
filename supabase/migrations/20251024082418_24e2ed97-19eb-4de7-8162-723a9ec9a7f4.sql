-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create HCOs (Healthcare Organizations) table
CREATE TABLE public.hcos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  website TEXT,
  access_level TEXT,
  segments TEXT[],
  tier TEXT CHECK (tier IN ('A', 'B', 'C')),
  introduction TEXT,
  latest_communication TEXT,
  digital_engagement TEXT,
  hcp_insights TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create HCPs (Healthcare Professionals) table
CREATE TABLE public.hcps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  hco_id UUID REFERENCES public.hcos(id) ON DELETE SET NULL,
  marketing_consent BOOLEAN DEFAULT false,
  access_level TEXT,
  last_meeting_date DATE,
  activity_plan TEXT,
  segments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interactions table
CREATE TABLE public.interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hco_id UUID REFERENCES public.hcos(id) ON DELETE CASCADE,
  hcp_id UUID REFERENCES public.hcps(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  interaction_date DATE NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hcos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hcps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "HCOs are viewable by everyone" ON public.hcos FOR SELECT USING (true);
CREATE POLICY "HCOs are insertable by everyone" ON public.hcos FOR INSERT WITH CHECK (true);
CREATE POLICY "HCOs are updatable by everyone" ON public.hcos FOR UPDATE USING (true);
CREATE POLICY "HCPs are viewable by everyone" ON public.hcps FOR SELECT USING (true);
CREATE POLICY "HCPs are insertable by everyone" ON public.hcps FOR INSERT WITH CHECK (true);
CREATE POLICY "HCPs are updatable by everyone" ON public.hcps FOR UPDATE USING (true);
CREATE POLICY "Interactions are viewable by everyone" ON public.interactions FOR SELECT USING (true);
CREATE POLICY "Interactions are insertable by everyone" ON public.interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Interactions are updatable by everyone" ON public.interactions FOR UPDATE USING (true);

-- Create indexes for better search performance
CREATE INDEX idx_hcos_name ON public.hcos USING gin(to_tsvector('danish', name));
CREATE INDEX idx_hcps_name ON public.hcps USING gin(to_tsvector('danish', name));
CREATE INDEX idx_hcps_hco_id ON public.hcps(hco_id);
CREATE INDEX idx_interactions_hco_id ON public.interactions(hco_id);
CREATE INDEX idx_interactions_hcp_id ON public.interactions(hcp_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_hcos_updated_at BEFORE UPDATE ON public.hcos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hcps_updated_at BEFORE UPDATE ON public.hcps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_interactions_updated_at BEFORE UPDATE ON public.interactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();