json.array!(@portfolios) do |portfolio|
  json.extract! portfolio, :id
  json.url portfolio_url(portfolio, format: :json)
end
