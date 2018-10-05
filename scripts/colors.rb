GREY = "\e[38;5;247m".freeze
GREEN = "\e[0;92m".freeze
CYAN = "\e[0;96m".freeze
RED = "\e[0;91m".freeze
NC = "\e[0m".freeze # No Color

def green(str)
  "#{GREEN}#{str}#{NC}"
end

def red(str)
  "#{RED}#{str}#{NC}"
end

def cyan(str)
  "#{CYAN}#{str}#{NC}"
end
